import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';

// Đảm bảo folder tồn tại
const uploadPath = 'images/';
fs.mkdirSync(uploadPath, { recursive: true });

const storage = diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    const fileNameString = `local-${file.fieldname}-${uniqueSuffix}${fileExtension}`;
    cb(null, fileNameString);
  },
});

const uploadLocal = {
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
};

export default uploadLocal;
