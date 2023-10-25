import serverless from 'serverless-http';

import app from '../../server.mjs';

export const handler = serverless(app);
