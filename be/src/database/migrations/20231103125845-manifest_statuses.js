'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const sql = `
ALTER TABLE "public"."manifests"
    ADD COLUMN "dispatched_at" TIMESTAMP WITH TIME ZONE;

ALTER TABLE "public"."manifests"
    ADD COLUMN "received_at" TIMESTAMP WITH TIME ZONE;

ALTER TABLE "public"."manifests"
    ADD COLUMN "dispatched_by_id" INTEGER REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
        `;
        return queryInterface.sequelize.query(sql, {
            type: Sequelize.QueryTypes.RAW,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('manifests', 'dispatched_at');
        await queryInterface.removeColumn('manifests', 'dispatched_by_id');
        await queryInterface.removeColumn('manifests', 'received_at');
    },
};
