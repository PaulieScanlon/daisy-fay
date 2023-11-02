import fs from 'fs';
import express from 'express';
import { createServer } from 'vite';

const app = express();

const vite = await createServer({
  server: {
    middlewareMode: true,
  },
  appType: 'custom',
});

(async () => {
  let data;

  app.use(vite.middlewares);

  app.use('*', async (req, res) => {
    const url = req.originalUrl;
    const safeUrl = url === '/' ? '/index' : req.originalUrl;

    try {
      const template = await vite.transformIndexHtml(url, fs.readFileSync('index.html', 'utf-8'));
      const { render } = await vite.ssrLoadModule('/src/entry-server.jsx');
      const functionFile = `src/pages${safeUrl}/function.js`;

      if (fs.existsSync(functionFile)) {
        const { getServerData } = await vite.ssrLoadModule(functionFile);
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

app.listen(4173, () => {
  console.log('http://localhost:4173.');
});
