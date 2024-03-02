import db from '@/database';
import prisma from '@/database/prisma';

export const get = async (req, res, next) => {
    try {
        const list = await db.models.question.findAndCountAll({
            include: [
                {
                    model: db.models.subQuestion,
                    as: 'subQuestions',
                    order: [['id', 'ASC']],
                },
            ],
            order: [['id', 'DESC']],
        });

        return res.json(list);
    } catch (err) {
        return next(err);
    }
};

export const getById = async (req, res, next) => {
    try {
        const question = await prisma.question.findUnique({
            where: { id: +req.params.id },
            include: { subQuestions: true, diagrams: true },
        });

        return res.json(question);
    } catch (err) {
        console.log(err);
        return next(err);
    }
};

export const create = async (req, res, next) => {
    try {
        const question = await prisma.question.create({
            data: {
                class: req.body.class,
                desc: req.body.desc,
                chapter: {
                    connect: {
                        id: req.body.chapterId,
                    },
                },
                subQuestions: { create: req.body.subQuestions },
                diagrams: { create: req.body.diagrams },
            },
        });
        return res.status(201).json(question);
    } catch (err) {
        console.log(err);
        return next(err);
    }
};

export const update = async (req, res, next) => {
    const tran = await db.transaction();
    try {
        const id = +req.params.id;
        const data = req.body;

        const question = await prisma.question.update({
            where: { id },
            data: {
                class: req.body.class,
                desc: req.body.desc,
                chapter: {
                    connect: {
                        id: req.body.chapterId,
                    },
                },
            },
            include: {
                subQuestions: true,
                diagrams: true,
            },
        });

        const dbSQ = question.subQuestions;
        const reqSQ = data.subQuestions;

        const delSQ = dbSQ.filter((l) => !reqSQ.some((r) => l.id === r.id));
        const addSQ = reqSQ.filter((l) => !dbSQ.some((r) => l.id === r.id));
        const upSQ = reqSQ.filter((l) => dbSQ.some((r) => l.id === r.id));

        const dbDgm = question.diagrams;
        const reqDgm = data.diagrams;

        await prisma.subQuestion.deleteMany({
            where: { id: { in: delSQ.map((x) => x.id) } },
        });

        for (let sq of upSQ) {
            await prisma.subQuestion.update({
                where: { id: sq.id },
                data: {
                    desc: sq.desc,
                },
            });
        }

        for (let sq of addSQ) {
            await prisma.subQuestion.create({
                data: {
                    desc: sq.desc,
                    question: {
                        connect: { id },
                    },
                },
            });
        }

        const delDgm = dbDgm.filter((l) => !reqDgm.some((r) => l.id === r.id));
        const addDgm = reqDgm.filter((l) => !dbDgm.some((r) => l.id === r.id));
        const upDgm = reqDgm.filter((l) => dbDgm.some((r) => l.id === r.id));

        await prisma.diagram.deleteMany({
            where: { id: { in: delDgm.map((x) => x.id) } },
        });

        for (let dgm of upDgm) {
            await prisma.diagram.update({
                where: { id: dgm.id },
                data: {
                    desc: dgm.desc,
                },
            });
        }

        for (let dgm of addDgm) {
            await prisma.diagram.create({
                data: {
                    desc: dgm.desc,
                    question: {
                        connect: { id },
                    },
                },
            });
        }

        return res.status(201).json(question);
    } catch (err) {
        console.log(err);
        tran.rollback();
        return next(err);
    }
};
