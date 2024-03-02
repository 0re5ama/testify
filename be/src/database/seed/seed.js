/* eslint no-console: "off", import/prefer-default-export: "off" */
import sequelize from '..';
import chapterSeed from './data/chapter';
import subjectSeed from './data/subject';
import unitSeed from './data/unit';

export async function resetDB() {
    console.log('Updating schema');

    const logging = (data) => {
        const fs = require('fs');
        fs.writeFile(
            '/home/xer0/migration.sql',
            data,
            { flag: 'a+' },
            (err) => {
                if (err) throw err;
            },
        );
    };

    await sequelize
        .sync({ force: true, alter: true })
        // .sync({ force: false, alter: true, logging })
        .catch((err) => console.log('error during update database', err));

    console.log('Done Updating schema');
    console.log('========================================================');
    console.error('Seeding Data');

    await sequelize.models.subject.bulkCreate(subjectSeed).catch(console.log);
    await sequelize.models.unit.bulkCreate(unitSeed).catch(console.log);
    await sequelize.models.chapter.bulkCreate(chapterSeed).catch(console.log);

    const password =
        '$2b$10$rUpBa6PLO0EZ6LrDj3YQxuROi6Vyzck1hKJ/EMu/nKCYJjG8ZxJ6.';
}

export async function seedTestData() {}
