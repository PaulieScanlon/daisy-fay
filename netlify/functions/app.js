import serverless from 'serverless-http';

import app from '../../server.cjs';

export const handler = serverless(app);
