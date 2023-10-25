import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { createServer as createViteServer } from 'vite';

const resolve = (file) => {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), file);
};

const exists = (file) => {
  return fs.existsSync(file);
};

async function createServer(isProduction = process.env.NODE_ENV === 'production') {
  const app = express();
  let vite, template, render, serverFile, serverFunction, serverData;

  if (isProduction) {
    app.use((await import('compression')).default());
    app.use(
      (await import('serve-static')).default(resolve('dist/client'), {
        index: false,
      })
    );
  } else {
    vite = await createViteServer({
      server: {
        middlewareMode: true,
      },
      appType: 'custom',
    });
    app.use(vite.middlewares);
  }

  app.use('*', async (req, res) => {
    const url = req.originalUrl;
    const safeUrl = url === '/' ? '/index' : req.originalUrl;

    try {
      if (isProduction) {
        template = fs.readFileSync(resolve('dist/client/index.html'), 'utf-8');
        render = (await import('./dist/server/entry-server.js')).render;
        serverFile = `./dist/functions${safeUrl}/function.js`;

        if (exists(serverFile)) {
          serverFunction = (await import(serverFile)).GET;
          serverData = await serverFunction();
        }
      } else {
        template = fs.readFileSync(resolve('index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        render = (await vite.ssrLoadModule('/src/entry-server.jsx')).render;
        serverFile = `src/pages${safeUrl}/function.js`;

        if (exists(serverFile)) {
          serverFunction = (await vite.ssrLoadModule(serverFile)).GET;
          serverData = await serverFunction();
        }
      }

      const dom = render(url, serverData);
      const script = `<script>window.__data__=${JSON.stringify(serverData)}</script>`;

      const html = template.replace(`<!--ssr-outlet-->`, `${dom} ${script}`);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (event) {
      !isProduction && vite.ssrFixStacktrace(event);
      console.log(event.stack);
      res.status(500).end(event.stack);
    }
  });

  return { app };
}

const server = await createServer();

server.app.listen(5173, () => {
  console.log('http://localhost:5173');
});
