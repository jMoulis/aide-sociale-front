'use server';

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { IVDOMNode } from './components/interfaces';


export const generateCss = async (vdom: IVDOMNode, pageId: string, organizationId: string): Promise<string> => {
  const tempInputPath = path.resolve(`./temp/temp-${pageId}.css`);
  const tempUsedClassesInputPath = path.resolve(`./temp/vdom-${pageId}.json`);
  const outputPath = path.resolve(`./public/styles/${organizationId}/page-${pageId}.css`);
  const tailwindDirectives = `
@tailwind base;
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
        // eslint-disable-next-line no-console
        console.error(`Error generating Tailwind CSS: ${stderr}`);
        return reject(error);
      }
      const css = fs.readFileSync(outputPath, 'utf-8');

      // eslint-disable-next-line no-console
      console.log(`CSS generated for page `);
      resolve(css); // Return the path to the generated CSS
    });
  });

}
export const generateTailwind = async (tailwindScript: string, savePath: string): Promise<string> => {
  // eslint-disable-next-line no-console
  console.log('Generating Tailwind CSS...');
  const tempInputPath = path.resolve(`./temp/temp-index.css`);
  const tempConfigPath = path.resolve(`./temp/temp-tailwind.config.js`);
  const tailwindDirectives = `
@tailwind components;
@tailwind utilities;
`;
  fs.mkdirSync("./temp", { recursive: true }); // Ensure the temp directory exists
  fs.writeFileSync(tempInputPath, tailwindDirectives); // Create the file
  fs.writeFileSync(tempConfigPath, tailwindScript);

  const outputPath = path.join(process.cwd(), `public/styles/${savePath}/tailwind.css`);
  const command = `npx tailwindcss --input ${tempInputPath} --output ${outputPath} --config ${tempConfigPath}`;

  return new Promise((resolve, reject) => {
    exec(command, (error, _, stderr) => {
      fs.unlinkSync(tempConfigPath);
      fs.unlinkSync(tempInputPath);
      if (error) {
        // eslint-disable-next-line no-console
        console.error(`Error generating Tailwind CSS: ${stderr}`);
        return reject(error.message);
      }
      const css = fs.readFileSync(outputPath, 'utf-8');

      // eslint-disable-next-line no-console
      console.log(`CSS generated for page `);
      resolve(css);
    });

  });

}
