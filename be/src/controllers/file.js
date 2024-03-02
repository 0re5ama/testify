/* eslint import/prefer-default-export: "off" */
const path = process.env.UPLOAD_PATH;

export const download = async (req, res, next) => {
    try {
        const file = `${path}/${req.params.file}`;
        return res.download(file, req.params.filename);
    } catch (err) {
        return next(err);
    }
};
