import db from '@/database';
import prisma from '@/database/prisma';

export const get = async (req, res, next) => {
    try {
        const list = await db.models.unit.findAndCountAll({
            order: [['id', 'ASC']],
        });

        return res.json(list);
    } catch (err) {
        return next(err);
    }
};

export const getChapters = async (req, res, next) => {
    const { id: unitId } = req.params;
    try {
        const list = await prisma.chapter.findMany({
            where: {
                unitId: +unitId,
            },
            orderBy: [{ id: 'asc' }],
        });

        return res.json({ rows: list, count: list.length });
    } catch (err) {
        console.log(err);
        return next(err);
    }
};

export const create = async (req, res, next) => {
    try {
        const unit = await db.models.unit.create(req.body);
        return res.status(201).json(unit);
    } catch (err) {
        return next(err);
    }
};

export const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const unit = await db.models.unit.update(req.body, {
            where: { id },
        });
        return res.status(201).json(unit);
    } catch (err) {
        return next(err);
    }
};
