import serverless from 'serverless-http';

import app from '../../dist/express/server.cjs';

export const handler = serverless(app);
