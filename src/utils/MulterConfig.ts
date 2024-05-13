import multer from 'multer';
import path from 'path';
import fs from "fs";
// Thiết lập Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const folder = path.resolve(`public/uploads`);
        if (!fs.existsSync(folder)) {
          fs.mkdirSync(folder);
        }
        cb(null, folder);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

export { upload };
