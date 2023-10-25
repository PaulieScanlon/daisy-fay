import fs from 'fs';
import express from 'express';

import { resolve, exists } from './src/utils/index.js';

export default app = express();

let template, render, serverFile, serverFunction, serverData;

app.use((await import('compression')).default());
app.use(
  (await import('serve-static')).default(resolve('dist/client', import.meta.url), {
    index: false,
  })
);

app.use('*', async (req, res) => {
  const url = req.originalUrl;
  const safeUrl = url === '/' ? '/index' : req.originalUrl;

  try {
    template = fs.readFileSync(resolve('./dist/client/index.html', import.meta.url), 'utf-8');
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

// app.listen(5173, () => {
//   console.log('http://localhost:5173');
// });
