import { glob } from 'glob';
import { build } from 'vite';

const viteBuild = async (params) => {
  await build({
    build: {
      ...params,
    },
  });
};

// setup
await viteBuild({ minify: false });

// entry-client;
await viteBuild({
  outDir: 'netlify/functions/client',
});

// entry-server;
await viteBuild({
  minify: false,
  ssr: true,
  rollupOptions: {
    input: 'src/entry-server.jsx',
    output: {
      dir: 'netlify/functions/server',
    },
  },
});

// functions
const functions = await glob('./src/pages/*/function.js');

await functions.forEach(async (file) => {
  await viteBuild({
    minify: false,
    ssr: true,
    rollupOptions: {
      input: file,
      output: {
        dir: `netlify/functions/functions/${file.split('/')[2]}`,
        format: 'cjs',
      },
    },
  });
});
