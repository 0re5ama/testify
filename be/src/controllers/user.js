/* eslint import/prefer-default-export: "off" */
import db from '@/database';

export const getAll = async (_req, res, next) => {
    try {
        const list = await db.models.user.findAndCountAll({
            order: [['id', 'ASC']],
            include: {
                model: db.models.location,
                attributes: ['id', 'name'],
            },
        });

        const response = list;
        return res.json(response);
    } catch (err) {
        return next(err);
    }
};

export const getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await db.models.user.findOne({
            where: { id },
            order: [['id', 'ASC']],
            include: {
                model: db.models.location,
                attributes: ['id', 'name'],
            },
        });

        delete user.password;
        const response = user;
        return res.json(response);
    } catch (err) {
        return next(err);
    }
};
