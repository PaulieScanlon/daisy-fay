import fs from 'fs';

const exists = (file) => {
  return fs.existsSync(file);
};

export default exists;
