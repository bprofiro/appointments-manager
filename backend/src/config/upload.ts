import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

const tpm = path.resolve(__dirname, '..', '..', 'tpm');

export default {
  directory: tpm,

  storage: multer.diskStorage({
    destination: tpm,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('HEX');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};
