import fs from 'fs';
import path from 'path';
import express from 'express';
import serverless from 'serverless-http';

import { render } from './server/entry-server';

const app = express();

const server = async () => {
  let template, serverFile, serverFunction, serverData;

  app.use('*', async (req, res) => {
    const url = req.originalUrl;
    const safeUrl = url === '/' ? '/index' : req.originalUrl;

    try {
      template = fs.readFileSync(`${__dirname}/client/index.html`, 'utf-8');
      serverFile = path.resolve(`${__dirname}/functions${safeUrl}/function.cjs`);

      if (fs.existsSync(serverFile)) {
        serverFunction = await require(serverFile).GET;
        serverData = await serverFunction();
      }

      const dom = render(url, serverData);
      const script = `<script>window.__data__=${JSON.stringify(serverData)}</script>`;
      const html = template.replace(`<!--ssr-outlet-->`, `${dom} ${script}`);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (error) {
      const dom = `<pre>${JSON.stringify(error, null, 2)}</pre>`;
      const html = template.replace(`<!--ssr-outlet-->`, dom);
      res.status(500).set({ 'Content-Type': 'text/html' }).end(html);
    }
  });
};

server();

export const handler = serverless(app);
