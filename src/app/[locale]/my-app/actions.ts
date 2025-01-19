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

/**
 * export default {
  darkMode: ["class"],
  content: [],
    prefix: "u-",
  safelist: [
      // Spacing (margin + padding).
    // e.g.: m-0, mt-2, mx-4, p-5, px-2, etc.
    { pattern: /^m([trblxy]?)-(\d+|auto|px)$/ },
    { pattern: /^p([trblxy]?)-(\d+|auto|px)$/ },

    // Flexbox.
    // e.g.: flex, inline-flex, flex-col, items-center, justify-between, gap-2, etc.
    { pattern: /^(flex|inline-flex)$/ },
    { pattern: /^flex-(row|col|wrap|nowrap|wrap-reverse)$/ },
    { pattern: /^items-(start|center|end|baseline|stretch)$/ },
    { pattern: /^justify-(start|center|end|between|around|evenly)$/ },
    { pattern: /^gap-(\d+|px)$/ },
    { pattern: /^flex-(\d)$/ },

    // Display / Position.
    { pattern: /^(block|inline-block|inline|grid|inline-grid)$/ },
    { pattern: /^(absolute|relative|fixed|sticky)$/ },

    // Width / Height / Min / Max (limited numeric scale example).
    { pattern: /^w-(\d+|auto|px|full|screen)$/ },
    { pattern: /^h-(\d+|auto|px|full|screen)$/ },
    { pattern: /^(min-w|min-h|max-w|max-h)-(\d+|full|screen)$/ },

    // Typography: text-size, font-weight, leading, etc.
    { pattern: /^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl)$/ },
    { pattern: /^font-(thin|extralight|light|normal|medium|semibold|bold|black)$/ },
    { pattern: /^leading-(none|tight|snug|normal|relaxed|loose)$/ },

    // Borders / Roundness.
    { pattern: /^border(-\d+)?$/ },
    { pattern: /^border-(solid|dashed|dotted|double|none)$/ },
    { pattern: /^border-(\w+)-(\d+)$/ }, // e.g. border-red-500 (depends on your color scale)
    { pattern: /^rounded(-(none|sm|md|lg|xl|2xl|3xl|full))?$/ },

    // Shadows.
    { pattern: /^shadow(-(sm|md|lg|xl|2xl|inner))?$/ },

    // Background colors (limited to certain palette slices).
    {
      pattern: /^bg-(red|green|blue|gray|indigo|yellow)-(100|200|300|400|500|600|700|800|900)$/,
    },

    // Text colors (similarly limited).
    {
      pattern: /^text-(red|green|blue|gray|indigo|yellow)-(100|200|300|400|500|600|700|800|900)$/,
    },

    // (Optional) Hover/focus states for some categories
    // e.g. hover:bg-blue-500, focus:bg-blue-500
    {
      pattern: /^hover:(bg|text)-(red|green|blue|gray|indigo|yellow)-(100|200|300|400|500|600|700|800|900)$/,
    },
    {
      pattern: /^focus:(bg|text)-(red|green|blue|gray|indigo|yellow)-(100|200|300|400|500|600|700|800|900)$/,
    },
  ],
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/aspect-ratio'),
    require('tailwindcss-animate'), // 3rd party
  ],
}

 */