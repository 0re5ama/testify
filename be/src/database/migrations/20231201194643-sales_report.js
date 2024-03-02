'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const sql = `
        CREATE OR REPLACE FUNCTION rpt_sales (p_client_id integer, p_from_date timestamp, p_to_date timestamp)
             RETURNS TABLE (
                 consignment_no varchar,
                 date timestamp with time zone,
                 sender_name varchar,
                 origin varchar,
                 receiver_name varchar,
                 destination varchar,
                 description varchar,
                 piece bigint,
                 weight numeric,
                 service_type enum_bookings_service_type
             )
             AS $$
        BEGIN
             RETURN QUERY
             SELECT
                 b.consignment_no,
                 b.created_at AS date,
                 b.sender_name,
                 o.name AS origin,
                 b.receiver_name,
                 d.name AS destination,
                 ''::varchar(100) AS description,
                 COALESCE(SUM(bi.piece), 0) AS piece,
                 COALESCE(SUM(bi.weight), 0) AS weight,
                 b.service_type
             FROM
                 bookings b
                 JOIN locations o ON o.id = b.origin_id
                 JOIN locations d ON d.id = b.destination_id
                 JOIN booking_items bi ON bi.booking_id = b.id
             WHERE
                 b.client_id = p_client_id
                 AND b.created_at BETWEEN p_from_date AND p_to_date
             GROUP BY
                 b.consignment_no,
                 b.created_at,
                 b.sender_name,
                 o.name,
                 b.receiver_name,
                 d.name,
                 b.service_type
             ORDER BY
                 b.created_at asc;
        END;
        $$
        LANGUAGE plpgsql;
        `;

        return queryInterface.sequelize.query(sql, {
            type: Sequelize.QueryTypes.RAW,
        });
    },

    async down(queryInterface, Sequelize) {
        const sql = `
        DROP FUNCTION get_bookings_data (client_id integer, from_date timestamp, to_date timestamp);
        `;

        return queryInterface.sequelize.query(sql, {
            type: Sequelize.QueryTypes.RAW,
        });
    },
};
