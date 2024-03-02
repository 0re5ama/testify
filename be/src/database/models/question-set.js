import { DataTypes, Model } from 'sequelize';
import questionType from '../enums/questionType';

export default function (sequelize) {
    class QuestionSet extends Model {
        static associate(models) {
            QuestionSet.belongsTo(models.subject, {
                foreignKey: 'subjectId',
                as: 'subject',
            });
            QuestionSet.belongsTo(models.unit, {
                foreignKey: 'unitId',
                as: 'unit',
            });
            QuestionSet.belongsTo(models.chapter, {
                foreignKey: 'chapterId',
                as: 'chapter',
            });
            QuestionSet.belongsToMany(models.question, {
                foreignKey: 'questionSetId',
                through: 'question_set_details',
                as: 'questions',
            });
        }
    }

    QuestionSet.init(
        {
            class: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            modelName: 'questionSet',
            sequelize,
        },
    );

    return QuestionSet;
}
