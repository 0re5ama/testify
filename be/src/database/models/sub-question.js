import { DataTypes, Model } from 'sequelize';
import questionType from '../enums/questionType';

export default function (sequelize) {
    class SubQuestion extends Model {
        static associate(models) {
            SubQuestion.belongsTo(models.question, {
                foreignKey: 'questionId',
                as: 'question',
            });
        }
    }

    SubQuestion.init(
        {
            desc: {
                type: DataTypes.STRING(1000),
                allowNull: false,
            },
        },
        {
            modelName: 'subQuestion',
            sequelize,
        },
    );

    return SubQuestion;
}
