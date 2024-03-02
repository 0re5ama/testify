import multer from 'multer';

const upload = multer({ dest: `${process.env.UPLOAD_PATH}/` });

export default upload;
