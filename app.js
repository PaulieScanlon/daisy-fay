import fs from 'fs';
import express from 'express';
import { createServer as createViteServer } from 'vite';

const app = express();

const server = async () => {
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
      template = fs.readFileSync('index.html', 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule('/src/entry-server.jsx')).render;
      serverFile = `src/pages${safeUrl}/function.js`;

      if (fs.existsSync(serverFile)) {
        serverFunction = (await vite.ssrLoadModule(serverFile)).GET;
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

app.listen(5173, () => {
  console.log('http://localhost:5173.');
});
