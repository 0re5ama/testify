import { DataTypes, Model } from 'sequelize';

export default function (sequelize) {
    class Chapter extends Model {
        static associate(models) {
            Chapter.hasMany(models.question, {
                foreignKey: 'chapterId',
                as: 'questions',
            });
            Chapter.belongsTo(models.subject, {
                foreignKey: 'subjectId',
                as: 'subject',
            });
        }
    }

    Chapter.init(
        {
            name: {
                type: DataTypes.STRING(150),
                allowNull: false,
            },
        },
        {
            modelName: 'chapter',
            sequelize,
        },
    );

    return Chapter;
}
