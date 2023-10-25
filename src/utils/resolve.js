import path from 'path';
import { fileURLToPath } from 'url';

const resolve = (file, url) => {
  return path.resolve(path.dirname(fileURLToPath(url)), file);
};

export default resolve;
