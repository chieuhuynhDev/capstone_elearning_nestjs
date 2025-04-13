import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';

export function createMulterConfig(
  folder: string,
  filenamePrefix: string = 'file',
) {
  const uploadPath = `images/${folder}`;
  fs.mkdirSync(uploadPath, { recursive: true });

  return {
    storage: diskStorage({
      destination: (_, __, cb) => cb(null, uploadPath),
      filename: (_, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = `${filenamePrefix}-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
        cb(null, name);
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
  };
}
