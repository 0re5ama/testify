import db from '@/database';
import prisma from '@/database/prisma';

export const get = async (req, res, next) => {
    try {
        const list = await prisma.subject.findMany({
            orderBy: [{ id: 'asc' }],
        });

        return res.json({ rows: list, count: list.length });
    } catch (err) {
        return next(err);
    }
};

export const getUnits = async (req, res, next) => {
    const { id: subjectId } = req.params;
    try {
        const list = await prisma.unit.findMany({
            where: {
                subjectId: +subjectId,
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
        const subject = await db.models.subject.create(req.body);
        return res.status(201).json(subject);
    } catch (err) {
        return next(err);
    }
};

export const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const subject = await db.models.subject.update(req.body, {
            where: { id },
        });
        return res.status(201).json(subject);
    } catch (err) {
        return next(err);
    }
};
