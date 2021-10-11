import multer from "multer";
import path from 'path';

const fileMimeTypes: any = {
    "image/png": "png",
    "image/jpeg": "jpeg",
    "image/jpg": "jpg",
    "image/gif": "gif",
}

const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
        const isValidFile = fileMimeTypes[file.mimetype];
        let error: any = new Error("Invalid Image");
        if (isValidFile) error = null;
        const pathToimages =  path.resolve("src", "images");
        cb(error, pathToimages);
    },

    filename: (req: any, file: any, cb: any) => {
        const name = file.originalname.toLocaleLowerCase().split(' ').join('-').split(".")[0];
        const ext = fileMimeTypes[file.mimetype];
        const fileName  = `${name}-${Date.now()}.${ext}`;
        cb(null,  fileName);
    }
})
 

export default multer({storage: storage}).single("file");