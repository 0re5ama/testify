import { DataTypes, Model } from 'sequelize';

export default function (sequelize) {
    class Unit extends Model {
        static associate(models) {
            Unit.hasMany(models.chapter, {
                foreignKey: 'unitId',
                as: 'chapters',
            });
            Unit.belongsTo(models.subject, {
                foreignKey: 'subjectId',
                as: 'subject',
            });
        }
    }

    Unit.init(
        {
            name: {
                type: DataTypes.STRING(150),
                allowNull: false,
            },
        },
        {
            modelName: 'unit',
            sequelize,
        },
    );

    return Unit;
}
