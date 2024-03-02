import { DataTypes, Model } from 'sequelize';
import questionType from '../enums/questionType';

export default function (sequelize) {
    class Question extends Model {
        static associate(models) {
            Question.belongsTo(models.subject, {
                foreignKey: 'subjectId',
                as: 'subject',
            });
            Question.belongsTo(models.unit, {
                foreignKey: 'unitId',
                as: 'unit',
            });
            Question.belongsTo(models.chapter, {
                foreignKey: 'chapterId',
                as: 'chapter',
            });
            Question.hasMany(models.subQuestion, {
                foreignKey: 'questionId',
            });
            Question.belongsToMany(models.questionSet, {
                foreignKey: 'questionSetId',
                through: 'question_set_details',
                as: 'questionSets',
            });
        }
    }

    Question.init(
        {
            desc: {
                type: DataTypes.STRING(2000),
                allowNull: false,
            },
            class: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            type: {
                type: DataTypes.ENUM(...Object.keys(questionType)),
                allowNull: true,
            },
        },
        {
            modelName: 'question',
            sequelize,
        },
    );

    return Question;
}
