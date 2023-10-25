import fs from 'fs';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import exists from './src/utils/exists.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const createServer = async () => {
  let template, render, serverFile, serverFunction, serverData;

  const resolve = (file) => {
    return path.resolve(__dirname, file);
  };

  app.use((await import('compression')).default());
  app.use(
    (await import('serve-static')).default(resolve('dist/client'), {
      index: false,
    })
  );

  app.use('*', async (req, res) => {
    const url = req.originalUrl;
    const safeUrl = url === '/' ? '/index' : req.originalUrl;

    try {
      template = fs.readFileSync(resolve('./dist/client/index.html'), 'utf-8');
      render = (await import('./dist/server/entry-server.js')).render;
      serverFile = `./dist/functions${safeUrl}/function.js`;

      if (exists(serverFile)) {
        serverFunction = (await import(serverFile)).GET;
        serverData = await serverFunction();
      }

      const dom = render(url, serverData);
      const script = `<script>window.__data__=${JSON.stringify(serverData)}</script>`;

      const html = template.replace(`<!--ssr-outlet-->`, `${dom} ${script}`);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (event) {
      console.log(event.stack);
      res.status(500).end(event.stack);
    }
  });
};

createServer();

export default app;

if (process.env.NODE_ENV === 'preview') {
  app.listen(5173, () => {
    console.log('http://localhost:5173');
  });
}
