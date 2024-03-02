/* eslint import/prefer-default-export: "off" */
import db from '@/database';

export const getAll = async (_req, res, next) => {
    try {
        const list = await db.models.fiscalYear.findAndCountAll({
            order: [['nameEng', 'ASC']],
        });

        const response = list;
        return res.json(response);
    } catch (err) {
        return next(err);
    }
};
