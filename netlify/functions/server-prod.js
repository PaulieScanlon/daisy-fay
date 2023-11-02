import fs from 'fs';
import path from 'path';
import express from 'express';
import serverless from 'serverless-http';

import { render } from './server/entry-server';

const app = express();

(async () => {
  let data;

  app.use('*', async (req, res) => {
    const url = req.originalUrl;
    const safeUrl = url === '/' ? '/index' : req.originalUrl;

    try {
      const template = fs.readFileSync(`${__dirname}/client/index.html`, 'utf-8');

      const functionFile = path.resolve(`${__dirname}/functions${safeUrl}/function.cjs`);

      if (fs.existsSync(functionFile)) {
        const { getServerData } = await require(functionFile);
        data = await getServerData();
      }

      const script = `<script>window.__data__=${JSON.stringify(data)}</script>`;
      const html = template.replace(`<!--ssr-outlet-->`, `${render(url, data)} ${script}`);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (error) {
      res.status(500).end(error);
    }
  });
})();

export const handler = serverless(app);
