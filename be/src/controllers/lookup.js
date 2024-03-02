import questionType from '@/database/enums/questionType';

export const getClasses = async (_req, res) =>
    res.json({
        count: 2,
        rows: [
            {
                value: 9,
                label: 'IX',
            },
            {
                value: 10,
                label: 'X',
            },
        ],
    });

export const getQuestionTypes = async (_req, res) =>
    res.json({
        count: Object.keys(questionType).length,
        rows: Object.keys(questionType).map((x) => ({
            value: 9,
            label: 'IX',
        })),
    });
