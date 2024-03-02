import { DataTypes, Model } from 'sequelize';

export default function (sequelize) {
    class Subject extends Model {
        static associate(models) {
            Subject.hasMany(models.unit, {
                foreignKey: 'subjectId',
                as: 'units',
            });
        }
    }

    Subject.init(
        {
            name: {
                type: DataTypes.STRING(150),
                allowNull: false,
                unique: true,
            },
            shortName: {
                type: DataTypes.STRING(30),
                allowNull: false,
                unique: true,
            },
        },
        {
            modelName: 'subject',
            sequelize,
        },
    );

    return Subject;
}
