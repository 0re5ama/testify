import db from '@/database';
import prisma from '@/database/prisma';
import { createWriteStream } from 'fs';
import latex from 'node-latex';
import { join } from 'path';
import { Readable } from 'stream';

export const get = async (req, res, next) => {
    try {
        const list = await db.models.question.findAndCountAll({
            include: [
                {
                    model: db.models.subQuestion,
                    as: 'subQuestions',
                },
            ],
            order: [['id', 'ASC']],
        });

        return res.json(list);
    } catch (err) {
        return next(err);
    }
};

export const create = async (req, res, next) => {
    const tran = await db.transaction();
    try {
        const question = await db.models.question.create(req.body, {
            transaction: tran,
        });
        await db.models.subQuestion.bulkCreate(
            req.body.subQuestions.map((x) => ({
                ...x,
                questionId: question.id,
            })),
            { transaction: tran },
        );
        tran.commit();
        return res.status(201).json(question);
    } catch (err) {
        console.log(err);
        return next(err);
    }
};

export const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const question = await db.models.question.update(req.body, {
            where: { id },
        });
        return res.status(201).json(question);
    } catch (err) {
        return next(err);
    }
};

export const print = async (req, res, next) => {
    try {
        const list = await db.models.question.findAndCountAll({
            include: [
                {
                    model: db.models.subQuestion,
                    as: 'subQuestions',
                },
            ],
            order: [['id', 'ASC']],
        });

        return res.json(list);
    } catch (err) {
        console.log(err);
        return next(err);
    }
};

export const testprint = async (req, res, next) => {
    return res.download('pdf/out.pdf');
};

export const printQuestions = async (req, res, next) => {
    let ids = req.body || [];
    try {
        const list = await prisma.question.findMany({
            where: {
                id: {
                    in: ids,
                },
            },
            orderBy: [{ id: 'desc' }],
            include: {
                chapter: { include: { unit: { include: { subject: true } } } },
                subQuestions: true,
                diagrams: true,
            },
        });

        const questions = ids.map((x) => list.find((y) => y.id === x));
        const inputLatex = genLatex(questions);

        const path = join(__dirname, '../../pdf/out.pdf');
        const s = new Readable();
        console.log(inputLatex);
        s.push(inputLatex);
        s.push(null);

        const output = createWriteStream(path);
        const stream = latex(s).pipe(output);

        res.set('Access-Control-Expose-Headers', 'Content-Disposition');
        stream.on('finish', function () {
            return res.download(path, 'set.pdf');
        });
    } catch (err) {
        console.log(err);
        return next(err);
    }
};

const genLatex = (questions) => {
    let subject = questions[0].chapter.unit.subject.name;
    let user = 'Shiva Sharan Shah';
    let qString = questions.map((q, i) => {
        let dgms = q.diagrams.map(
            (dgm) => `
            \\begin{tikzpicture}[baseline=(current bounding box.north)]
                ${dgm.desc}
            \\end{tikzpicture}
            `,
        );

        let subqs = q.subQuestions.map(
            (sq, j) => `
                \\item ${sq.desc
                    .replaceAll(/\\?\$/g, '\\$')
                    .replaceAll(/\\?%/g, '\\%')}
`,
        );
        let subqString = '';
        if (subqs.length) {
            subqString = `
                \\begin{enumerate}
                    ${subqs.join('\n')}
                \\end{enumerate}
            `;
        }

        if (dgms && dgms.length) {
            return `
            \\begingroup\\interlinepenalty=10000
                \\item
                    \\begin{minipage}[t]{0.7\\linewidth}
                        ${q.desc
                            .replaceAll(/\\?\$/g, '\\$')
                            .replaceAll(/\\?%/g, '\\%')}
                        ${subqString}
                    \\end{minipage}
                    \\hfill
                    \\begin{minipage}[t]{0.3\\linewidth}
                        ${dgms}
                    \\end{minipage}
            \\endgroup
            `;
        } else {
            return (
                `
            \\begingroup\\interlinepenalty=10000
            \\item ${q.desc
                .replaceAll(/\\?\$/g, '\\$')
                .replaceAll(/\\?%/g, '\\%')}
            ` +
                subqString +
                `
            \\endgroup
            `
            );
        }
    });
    return `
\\documentclass[a4paper,landscape]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{dirtytalk}
\\usepackage{amsmath}
\\usepackage{tikz}
\\usepackage{tkz-euclide}
\\usepackage{amssymb}
\\usepackage{multicol}
\\usepackage[a4paper,margin=0.3in,landscape]{geometry}
\\usetikzlibrary {calc, perspective, intersections, through, decorations.markings}

\\title{${subject || 'Mathematics'}}
\\author{${user}}
\\date{${new Date().toISOString().substring(0, 10)}}

\\tikzset{gl/.style={very thin,color=#1!50}, gl/.default=gray}

\\tikzset{%
->-/.style={decoration={markings, mark=at position 0.5 with {\\arrow{>}}},
postaction={decorate}},
->>-/.style={decoration={markings, mark=at position 0.5 with {\\arrow{>>}}},
postaction={decorate}},
}

\\begin{document}

\\begin{multicols*}{2}
    \\section{Questions}
    \\subsection{Group A}
        \\begin{enumerate}
            ${qString.join('\n')}
        \\end{enumerate}
    \\end{multicols*}
\\end{document}
    `;
};
