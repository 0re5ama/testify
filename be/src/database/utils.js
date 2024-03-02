import db from '@/database';
import { QueryTypes } from 'sequelize';

export const rptQuery = async (func, params) => {
    let replacements = {};
    let placeholders = params
        .map((p, i) => {
            replacements['p_' + (i + 1)] = p ?? null;
            return ':p_' + (i + 1);
        })
        .join(',');

    const list = await db.query(`select * from ${func}(${placeholders});`, {
        replacements,
        mapToModel: true,
        nest: true,
        type: QueryTypes.SELECT,
    });

    const transformedList = list.map((row) => {
        const transformedRow = {};
        for (const key in row) {
            if (Object.prototype.hasOwnProperty.call(row, key)) {
                const camelCaseKey = key.replace(/_([a-z])/g, (match, letter) =>
                    letter.toUpperCase(),
                );
                transformedRow[camelCaseKey] = row[key];
            }
        }
        return transformedRow;
    });

    return {
        count: list.length,
        rows: transformedList,
    };
};
