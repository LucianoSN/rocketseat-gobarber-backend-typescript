import crypto from 'crypto';
import path from 'path';
import multer from 'multer';
import e from 'express';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
    directory: tmpFolder,

    storage: multer.diskStorage({
        destination: tmpFolder,
        filename(
            req: e.Request,
            file: Express.Multer.File,
            callback: (error: Error | null, filename: string) => void
        ) {
            const fileHash = crypto.randomBytes(10).toString('hex');
            const fileName = `${fileHash}-${file.originalname}`;

            return callback(null, fileName);
        },
    }),
};
