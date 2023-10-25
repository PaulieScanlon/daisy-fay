import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { Router } from './router';

export const render = (url, data) => {
  return renderToString(
    <StaticRouter location={url}>
      <Router data={data} />
    </StaticRouter>
  );
};
