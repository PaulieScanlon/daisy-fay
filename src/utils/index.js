import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export const resolve = (file, url) => {
  return path.resolve(path.dirname(fileURLToPath(url)), file);
};

export const exists = (file) => {
  return fs.existsSync(file);
};
