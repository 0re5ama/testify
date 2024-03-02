import db from '@/database';
import prisma from '@/database/prisma';

export const get = async (req, res, next) => {
    try {
        const list = await db.models.chapter.findAndCountAll({
            order: [['id', 'ASC']],
        });

        return res.json(list);
    } catch (err) {
        return next(err);
    }
};

export const getQuestions = async (req, res, next) => {
    const { id: chapterId } = req.params;
    try {
        const list = await prisma.question.findMany({
            where: {
                chapterId: +chapterId,
            },
            orderBy: [{ id: 'desc' }],
            include: { subQuestions: true },
        });

        return res.json({ rows: list, count: list.length });
    } catch (err) {
        console.log(err);
        return next(err);
    }
};

export const create = async (req, res, next) => {
    try {
        const chapter = await db.models.chapter.create(req.body);
        return res.status(201).json(chapter);
    } catch (err) {
        return next(err);
    }
};

export const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const chapter = await db.models.chapter.update(req.body, {
            where: { id },
        });
        return res.status(201).json(chapter);
    } catch (err) {
        return next(err);
    }
};
