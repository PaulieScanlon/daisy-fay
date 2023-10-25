import fs from 'fs';
import express from 'express';
import { createServer as createViteServer } from 'vite';

import exists from './src/utils/exists.js';
import resolve from './src/utils/resolve.js';

const app = express();

let template, render, serverFile, serverFunction, serverData;

const vite = await createViteServer({
  server: {
    middlewareMode: true,
  },
  appType: 'custom',
});

app.use(vite.middlewares);

app.use('*', async (req, res) => {
  const url = req.originalUrl;
  const safeUrl = url === '/' ? '/index' : req.originalUrl;

  try {
    template = fs.readFileSync(resolve('index.html', import.meta.url), 'utf-8');
    template = await vite.transformIndexHtml(url, template);
    render = (await vite.ssrLoadModule('/src/entry-server.jsx')).render;
    serverFile = `src/pages${safeUrl}/function.js`;

    if (exists(serverFile)) {
      serverFunction = (await vite.ssrLoadModule(serverFile)).GET;
      serverData = await serverFunction();
    }

    const dom = render(url, serverData);
    const script = `<script>window.__data__=${JSON.stringify(serverData)}</script>`;
    const html = template.replace(`<!--ssr-outlet-->`, `${dom} ${script}`);

    res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
  } catch (event) {
    vite.ssrFixStacktrace(event);
    console.log(event.stack);
    res.status(500).end(event.stack);
  }
});

app.listen(4173, () => {
  console.log('http://localhost:4173');
});
