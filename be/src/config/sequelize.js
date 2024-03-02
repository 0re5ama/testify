import 'dotenv/config';

const {
    DB_DIALECT,
    DB_HOST,
    DB_PORT = 5432,
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    DB_SSL,
} = process.env;

const defaultConfig = {
    dialect: DB_DIALECT,
    timezone: '+05:45',
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    port: Number(DB_PORT),
    define: {
        paranoid: true,
        underscored: true,
    },
    logging: true,
};

if (JSON.parse(DB_SSL))
    defaultConfig.dialectOptions = {
        ssl: {
            require: true,
            rejectUnauthorized: false, // added for self-signed certificates
        },
    };

export const development = {
    ...defaultConfig,
};

export const test = {
    ...defaultConfig,
    logging: false,
};

export const production = {
    ...defaultConfig,
    logging: false,
};
