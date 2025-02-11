'use server';

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { IVDOMNode } from './components/interfaces';
import { bucket } from '@/lib/firebase/firebaseAdmin';
import { getDownloadURL } from 'firebase-admin/storage';
import { IPage, IPageTemplateVersion, IStylesheet, IWebsite } from '@/lib/interfaces/interfaces';
import clientMongoServer from '@/lib/mongo/initMongoServer';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { IMasterTemplate } from '@/lib/TemplateBuilder/interfaces';

const uploadFile = async (localPath: string, storagePath: string) => {
  const fileRef = bucket.file(storagePath);
  await bucket.upload(localPath, {
    destination: storagePath,
    public: true, // Make the file publicly accessible
  });
  const downloadUrl = await getDownloadURL(fileRef);
  return downloadUrl;
};

function parseErrorMessage(stderr: string) {
  const commandMatch = stderr.match(/Command failed: (.+)/);
  const errorTypeMatch = stderr.match(/(\w+Error):\s(.+)/);
  const locationMatch = stderr.match(/at\s.+\(([^:]+):(\d+):(\d+)\)/);

  const parsed = {
    command: commandMatch ? commandMatch[1] : null,
    errorType: errorTypeMatch ? errorTypeMatch[1] : null,
    errorMessage: errorTypeMatch ? errorTypeMatch[2].split("\n")[0].trim() : null,
    file: locationMatch ? locationMatch[1] : null,
    line: locationMatch ? locationMatch[2] : null,
    column: locationMatch ? locationMatch[3] : null,
  };
  return parsed;
}

async function downloadFilesFromLinks(links: string[]): Promise<string[]> {
  const tempFolder = './temp';

  // Ensure the temp folder exists
  fs.mkdirSync(tempFolder, { recursive: true });

  const tempFilePaths: string[] = [];

  // Loop through the links
  for (const link of links) {
    try {
      // Extract the file path from the link (e.g., "folder/fileName.ext")
      const filePath = new URL(link).pathname.split('/o/')[1].replace(/%2F/g, "/");
      const file = bucket.file(filePath);
      const tempFilePath = path.resolve(tempFolder, path.basename(filePath));
      tempFilePaths.push(tempFilePath);

      // Download the file
      await file.download({ destination: tempFilePath });
      // eslint-disable-next-line no-console
      console.log(`File downloaded to: ${tempFilePath}`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Failed to download file from link: ${link}`, error);
    }
  }

  return tempFilePaths;
}
export const generateCss = async (vdom: IVDOMNode, pageId: string, organizationId: string): Promise<string> => {
  const tempInputPath = path.resolve(`./temp/temp-${pageId}.css`);
  const tempUsedClassesInputPath = path.resolve(`./temp/vdom-${pageId}.json`);
  const outputPath = path.resolve(`./public/styles/${organizationId}/page-${pageId}.css`);
  const tailwindDirectives = `
@tailwind components;
@tailwind utilities;
`;
  fs.mkdirSync(path.dirname(tempInputPath), { recursive: true }); // Ensure the temp directory exists
  fs.writeFileSync(tempUsedClassesInputPath, JSON.stringify(vdom));
  fs.writeFileSync(tempInputPath, tailwindDirectives); // Create the file

  const command = `npx tailwindcss -i ${tempInputPath} -o ${outputPath} --content ${tempUsedClassesInputPath} --minify`;

  return new Promise((resolve, reject) => {
    // Step 3: Run the CLI command
    exec(command, (error, _stdout, stderr) => {
      // Step 4: Clean up the temporary file
      fs.unlinkSync(tempInputPath);
      fs.unlinkSync(tempUsedClassesInputPath);
      if (error) {
        return reject(JSON.stringify(parseErrorMessage(stderr)));
      }
      const css = fs.readFileSync(outputPath, 'utf-8');

      // eslint-disable-next-line no-console
      console.log(`CSS generated for page `);
      resolve(css); // Return the path to the generated CSS
    });
  });

}

const MAIN_NAME_FILE = 'main';
const COMPILED_NAME_FILE = 'compiled';

const processStylesheetsFilesTailwindImports = async (stylesheets: IStylesheet[]) => {
  const filteredStylesheets = stylesheets.filter((stylesheet) => stylesheet.name !== COMPILED_NAME_FILE).map((stylesheet) => stylesheet.uri);
  const filesTempsUris = await downloadFilesFromLinks(filteredStylesheets);
  const rootDirective = `
 @tailwind components;
  @tailwind utilities;
  `
  return {
    paths: filesTempsUris,
    rootDirective,
    directives: `
  ${filesTempsUris.map((uri) => `@import "${uri}";`).join('\n')}

${rootDirective}
`};
};

const processPagesVdom = async (websiteId: string) => {
  const { data: pages } = await clientMongoServer.list<IPage>(ENUM_COLLECTIONS.PAGES, {
    websiteId,
  })
  const vdoms = await Promise.all((pages || []).map(async (page) => {
    const { data: masterTemplates } = await clientMongoServer.list<IMasterTemplate>(ENUM_COLLECTIONS.TEMPLATES_MASTER, {
      _id: {
        $in: page.masterTemplateIds || []
      }
    });
    const templates = await Promise.all((masterTemplates || []).map(async (masterTemplate) => {
      const { data: templates } = await clientMongoServer.list<IPageTemplateVersion>(ENUM_COLLECTIONS.PAGE_TEMPLATES, {
        masterTemplateId: masterTemplate?._id
      });
      return templates?.map((template) => template.vdom) || [];
    }));

    return templates.flat();
  }));

  // Step 5: create temp txt file with all vdom props
  const tempVdomPath = path.resolve(`./temp/vdoms.json`);
  fs.writeFileSync(tempVdomPath, JSON.stringify(vdoms));
  return { tempVdomPath };
}
const execution = (tempInputPath: string, outputPath: string, tempConfigPath: string, tempVdomPath: string, compiledStoragePath: string, paths: string[] = [], shouldCleanup: boolean): Promise<{ css: string; path: string }> => {
  const command = `npx tailwindcss --input ${tempInputPath} --output ${outputPath} --config ${tempConfigPath} --content ${tempVdomPath}`;
  return new Promise((resolve, reject) => {
    exec(command, async (error, _, stderr) => {
      if (error) {
        return reject(JSON.stringify(parseErrorMessage(stderr)));
      }
      try {
        const css = fs.readFileSync(outputPath, 'utf-8');
        const tailwindPath = path.resolve(outputPath);
        const [mainUrl] = await Promise.all([
          uploadFile(tailwindPath, compiledStoragePath),
        ]);
        resolve({ css, path: mainUrl });
      } catch (error: any) {
        reject({ pageUrl: null, mainUrl: null, error: error.message });
      } finally {
        if (!shouldCleanup) return;
        // eslint-disable-next-line no-console
        console.log('Cleaning up...');
        paths.forEach((path) => fs.unlinkSync(path));
      }
    });
  });
}

const updateWebsite = async (website: IWebsite, stylesheetsToUpsert: IStylesheet[]) => {
  // eslint-disable-next-line no-console
  console.log('Updating website...');
  const prevStylesheets = website.stylesheets || [];

  const updatedStylesheets = stylesheetsToUpsert.reduce((acc, stylesheet) => {
    const prevStylesheet = acc.find((prevStylesheet) => prevStylesheet.name === stylesheet.name);
    if (prevStylesheet) {
      return acc.map((prevStylesheet) => prevStylesheet.name === stylesheet.name ? stylesheet : prevStylesheet);
    }
    return [...acc, stylesheet];
  }, prevStylesheets);
  clientMongoServer.update<IWebsite>(ENUM_COLLECTIONS.WEBSITES, { _id: website._id }, {
    $set: {
      stylesheets: updatedStylesheets
    }
  });
  return { ...website, stylesheets: updatedStylesheets };
}
export const generateTailwind = async (tailwindScript: string, organizationId: string, website: IWebsite,): Promise<void> => {
  // eslint-disable-next-line no-console
  console.log('Generating compiled CSS...');
  // generateTailwindStylesheet(tailwindScript, organizationId, website);
  const { directives, paths, rootDirective } = await processStylesheetsFilesTailwindImports(website.stylesheets || []);
  const { tempVdomPath } = await processPagesVdom(website._id);

  const tempInputPath = path.resolve(`./temp/temp-index.css`);
  const tempConfigPath = path.resolve(`./temp/temp-tailwind.config.js`);
  const outputPath = path.resolve(`./temp/${COMPILED_NAME_FILE}.css`);

  const tempUtilsOutputPath = path.resolve(`./temp/utils.css`);
  const tempInputUtilsPath = path.resolve(`./temp/temp-utils.css`);

  fs.mkdirSync("./temp", { recursive: true }); // Ensure the temp directory exists
  fs.writeFileSync(tempInputUtilsPath, rootDirective);
  fs.writeFileSync(tempInputPath, directives);
  fs.writeFileSync(tempConfigPath, tailwindScript);

  Promise.all(
    [
      execution(tempInputUtilsPath, tempUtilsOutputPath, tempConfigPath, tempVdomPath, `websites/${organizationId}/${website._id}/utils.css`, [], false), execution(tempInputPath, outputPath, tempConfigPath, tempVdomPath, `websites/${organizationId}/${website._id}/${COMPILED_NAME_FILE}.css`, [...paths, tempInputUtilsPath, tempConfigPath, tempInputPath], true)
    ]).then(([utils, main]) => {
      updateWebsite(website, [{ name: 'utils', uri: utils.path }, { name: COMPILED_NAME_FILE, uri: main.path }]);
      // eslint-disable-next-line no-console
    }).catch((error) => console.log(error)).finally(() => {
      // eslint-disable-next-line no-console
      console.log('All done');
    });

}

export const generateStylesheet = async (
  style: string,
  pageStoragePath: string
): Promise<{ pageUrl: string | null, error?: string }> => {
  ;
  const pageStylesPath = path.resolve(`./temp/temps.css`);

  fs.mkdirSync('./temp', { recursive: true });
  fs.writeFileSync(pageStylesPath, style);
  try {
    const [pageUrl] = await Promise.all([
      uploadFile(pageStylesPath, pageStoragePath),
    ]);
    fs.unlinkSync(pageStylesPath);
    return { pageUrl };
  } catch (error: any) {
    return { pageUrl: null, error: error.message };
  }
};

export const updateMainStylesheet = async (
  style: string,
  organizationId: string,
  website: IWebsite
): Promise<{ pageUrl: string | null, error?: string }> => {
  const mainStoragePath = `websites/${organizationId}/${website._id}/${MAIN_NAME_FILE}.css`;
  const pageStylesPath = path.resolve(`./temp/${MAIN_NAME_FILE}.css`);

  fs.mkdirSync('./temp', { recursive: true });
  fs.writeFileSync(pageStylesPath, style);
  try {
    const [pageUrl] = await Promise.all([
      uploadFile(pageStylesPath, mainStoragePath),
    ]);

    return { pageUrl };
  } catch (error: any) {
    return { pageUrl: null, error: error.message };
  }
};


