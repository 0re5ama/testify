import { compare, hash } from 'bcrypt';
import { DataTypes, Model } from 'sequelize';

import { tokenHelper, mailHelper } from '@/helpers';

export default function (sequelize) {
    class User extends Model {
        get fullName() {
            return `${this.firstName} ${this.lastName}`;
        }

        generateToken(expiresIn = '1h') {
            const data = {
                id: this.id,
                email: this.email,
                userName: this.userName,
            };
            return tokenHelper.generateToken(data, expiresIn);
        }

        validatePassword(plainPassword) {
            return compare(plainPassword, this.password);
        }

        sendMail(mail) {
            const payload = { ...mail, to: `${this.fullName} <${this.email}>` };
            return mailHelper.sendMail(payload);
        }
        static associate(models) {
            // User.belongsTo(models.location, { foreignKey: 'locationId' });
            // User.hasMany(models.booking, { foreignKey: 'createdById' });
        }
    }

    User.init(
        {
            firstName: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            middleName: {
                type: DataTypes.STRING(30),
                allowNull: true,
            },
            lastName: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            phone: {
                type: DataTypes.STRING(50),
                allowNull: false,
                unique: true,
            },
            userName: {
                type: DataTypes.STRING(50),
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            isAdmin: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            status: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
        },
        {
            modelName: 'user',
            sequelize,
        },
    );

    User.addHook('beforeSave', async (instance) => {
        if (instance.changed('password')) {
            // eslint-disable-next-line no-param-reassign
            instance.password = await hash(instance.password, 10);
        }
    });

    User.addHook('afterCreate', (instance) => {
        // Send welcome message to user.
        const payload = {
            subject: 'Welcome to Express Starter',
            html: 'Your account is created successfully!',
        };
        instance.sendMail(payload);
    });

    User.addHook('afterDestroy', (instance) => {
        // Send good by message to user.
        const payload = {
            subject: 'User Removal',
            html: 'Account has been removed successfully!',
        };
        instance.sendMail(payload);
    });

    return User;
}
