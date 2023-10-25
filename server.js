import fs from 'fs';
import express from 'express';

import exists from './src/utils/exists.js';

const app = express();

const createServer = async () => {
  let template, render, serverFile, serverFunction, serverData;

  const assetPath = process.env.NODE_ENV === 'preview' ? './dist' : process.cwd();

  app.use((await import('compression')).default());
  app.use(
    (await import('serve-static')).default(`${assetPath}/client`, {
      index: false,
    })
  );

  app.use('*', async (req, res) => {
    const url = req.originalUrl;
    const safeUrl = url === '/' ? '/index' : req.originalUrl;

    try {
      template = fs.readFileSync(`${assetPath}/client/index.html`, 'utf-8');
      render = (await import(`${assetPath}/server/entry-server.js`)).render;
      serverFile = `${assetPath}/functions${safeUrl}/function.js`;

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
