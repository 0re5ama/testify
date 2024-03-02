import { Sequelize } from 'sequelize';

import * as config from '@/config/sequelize';

// import models
import userModel from './models/user';
import subjectModel from './models/subject';
import unitModel from './models/unit';
import chapterModel from './models/chapter';
import questionModel from './models/question';
import subQuestionModel from './models/sub-question';
import questionSetModel from './models/question-set';

// Configuration
const env = process.env.NODE_ENV;
const sequelizeConfig = config[env];

// Create sequelize instance
const sequelize = new Sequelize(sequelizeConfig);

// Import all model files
const modelDefiners = [
    userModel,
    subjectModel,
    unitModel,
    chapterModel,
    questionModel,
    subQuestionModel,
    questionSetModel,
];

// eslint-disable-next-line no-restricted-syntax
for (const modelDefiner of modelDefiners) {
    modelDefiner(sequelize);
}

// Associations
Object.keys(sequelize.models).forEach((modelName) => {
    if (sequelize.models[modelName].associate) {
        sequelize.models[modelName].associate(sequelize.models);
    }
});

export default sequelize;
