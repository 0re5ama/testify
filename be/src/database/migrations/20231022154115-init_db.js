'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const sql = `

CREATE TABLE IF NOT EXISTS "districts" (
    "id" serial,
    "name" varchar(30) NOT NULL UNIQUE,
    "created_at" timestamp with time zone NOT NULL,
    "updated_at" timestamp with time zone NOT NULL,
    "deleted_at" timestamp with time zone,
    PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "locations" (
    "id" serial,
    "name" varchar(30) NOT NULL,
    "code" varchar(3) NOT NULL,
    "contact_name" varchar(30) NOT NULL,
    "contact_no" varchar(30) NOT NULL,
    "status" boolean NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "updated_at" timestamp with time zone NOT NULL,
    "deleted_at" timestamp with time zone,
    "district_id" integer REFERENCES "districts" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "users" (
    "id" serial,
    "first_name" varchar(30) NOT NULL,
    "middle_name" varchar(30),
    "last_name" varchar(30) NOT NULL,
    "email" varchar(50),
    "phone" varchar(50) NOT NULL UNIQUE,
    "user_name" varchar(50) NOT NULL UNIQUE,
    "password" varchar(255) NOT NULL,
    "is_admin" boolean NOT NULL,
    "status" boolean NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "updated_at" timestamp with time zone NOT NULL,
    "deleted_at" timestamp with time zone,
    "location_id" integer REFERENCES "locations" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "fiscal_years" (
    "id" serial,
    "name_eng" varchar(30) NOT NULL UNIQUE,
    "name_nep" varchar(30) NOT NULL UNIQUE,
    "curr" boolean NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "updated_at" timestamp with time zone NOT NULL,
    "deleted_at" timestamp with time zone,
    PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "months" (
    "id" serial,
    "name_eng" varchar(30) NOT NULL UNIQUE,
    "name_nep" varchar(30) NOT NULL UNIQUE,
    "fy_order" integer NOT NULL UNIQUE,
    "created_at" timestamp with time zone NOT NULL,
    "updated_at" timestamp with time zone NOT NULL,
    "deleted_at" timestamp with time zone,
    PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "wards" (
    "id" serial,
    "name_eng" varchar(30) NOT NULL UNIQUE,
    "name_nep" varchar(30) NOT NULL UNIQUE,
    "created_at" timestamp with time zone NOT NULL,
    "updated_at" timestamp with time zone NOT NULL,
    "deleted_at" timestamp with time zone,
    PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "clients" (
    "id" serial,
    "name" varchar(30) NOT NULL,
    "contact_number" varchar(30) NOT NULL,
    "email" varchar(30),
    "address" varchar(30),
    "pan" varchar(30),
    "status" boolean NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "updated_at" timestamp with time zone NOT NULL,
    "deleted_at" timestamp with time zone,
    "location_id" integer REFERENCES "locations" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    PRIMARY KEY ("id")
);

DO 'BEGIN CREATE TYPE "public"."enum_bookings_service_type" AS ENUM(''air'', ''surface''); EXCEPTION WHEN duplicate_object THEN null; END';

DO 'BEGIN CREATE TYPE "public"."enum_bookings_payment_mode" AS ENUM(''cod'', ''topay'', ''due'', ''paid''); EXCEPTION WHEN duplicate_object THEN null; END';

DO 'BEGIN CREATE TYPE "public"."enum_bookings_status" AS ENUM(''booked'', ''manifest'', ''received'', ''forwarding'', ''arrived'', ''shipping'', ''pod'', ''rto''); EXCEPTION WHEN duplicate_object THEN null; END';

CREATE TABLE IF NOT EXISTS "bookings" (
    "id" serial,
    "consignment_no" varchar(9) NOT NULL UNIQUE,
    "sender_name" varchar(50) NOT NULL,
    "sender_contact_no" varchar(30) NOT NULL,
    "sender_email" varchar(50) NOT NULL,
    "sender_pan" varchar(9) NOT NULL,
    "receiver_name" varchar(30) NOT NULL,
    "receiver_contact_no" varchar(30) NOT NULL,
    "receiver_addr" varchar(500) NOT NULL,
    "receiver_pan" real NOT NULL,
    "service_type" "public"."enum_bookings_service_type" NOT NULL,
    "declared_value" DECIMAL,
    "ref_no" varchar(10),
    "instruction" varchar(500),
    "payment_mode" "public"."enum_bookings_payment_mode" NOT NULL DEFAULT 'cod',
    "other_charge" DECIMAL NOT NULL DEFAULT 0,
    "tax" DECIMAL NOT NULL DEFAULT 0,
    "st_charge" DECIMAL NOT NULL DEFAULT 0,
    "tot_amt" DECIMAL NOT NULL DEFAULT 0,
    "status" "public"."enum_bookings_status" NOT NULL,
    "comment" varchar(100),
    "created_at" timestamp with time zone NOT NULL,
    "updated_at" timestamp with time zone NOT NULL,
    "deleted_at" timestamp with time zone,
    "created_by_id" integer REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "current_location_id" integer REFERENCES "locations" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "client_id" integer REFERENCES "clients" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "origin_id" integer REFERENCES "locations" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "destination_id" integer REFERENCES "locations" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    PRIMARY KEY ("id")
);

DO 'BEGIN CREATE TYPE "public"."enum_booking_items_unit" AS ENUM(''piece'', ''weight'', ''fix''); EXCEPTION WHEN duplicate_object THEN null; END';

CREATE TABLE IF NOT EXISTS "booking_items" (
    "id" serial,
    "desc" varchar(150) NOT NULL,
    "piece" integer NOT NULL,
    "weight" DECIMAL NOT NULL,
    "unit" "public"."enum_booking_items_unit" NOT NULL DEFAULT 'fix',
    "rate" DECIMAL NOT NULL DEFAULT 0,
    "total" DECIMAL NOT NULL DEFAULT 0,
    "created_at" timestamp with time zone NOT NULL,
    "updated_at" timestamp with time zone NOT NULL,
    "deleted_at" timestamp with time zone,
    "booking_id" integer REFERENCES "bookings" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    PRIMARY KEY ("id")
);

DO 'BEGIN CREATE TYPE "public"."enum_manifests_status" AS ENUM(''created'', ''dispatched'', ''received''); EXCEPTION WHEN duplicate_object THEN null; END';

CREATE TABLE IF NOT EXISTS "manifests" (
    "id" serial,
    "manifest_no" varchar(7) NOT NULL UNIQUE,
    "date" timestamp with time zone NOT NULL,
    "vehicle_no" varchar(10) NOT NULL,
    "driver_name" varchar(50) NOT NULL,
    "mobile_no" varchar(30) NOT NULL,
    "freight" real NOT NULL,
    "advance" real NOT NULL DEFAULT '0',
    "balance" real NOT NULL DEFAULT '0',
    "status" "public"."enum_manifests_status" NOT NULL,
    "checked_by" varchar(30),
    "created_at" timestamp with time zone NOT NULL,
    "updated_at" timestamp with time zone NOT NULL,
    "deleted_at" timestamp with time zone,
    "origin_id" integer REFERENCES "locations" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "destination_id" integer REFERENCES "locations" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "created_by_id" integer REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "received_by_id" integer REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "rates" (
    "id" serial,
    "rate" DECIMAL NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "updated_at" timestamp with time zone NOT NULL,
    "deleted_at" timestamp with time zone,
    "origin_id" integer REFERENCES "locations" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "destination_id" integer REFERENCES "locations" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "manifest_bookings" (
    "created_at" timestamp with time zone NOT NULL,
    "updated_at" timestamp with time zone NOT NULL,
    "booking_id" integer REFERENCES "bookings" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "manifest_id" integer REFERENCES "manifests" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY ("booking_id", "manifest_id")
);

CREATE VIEW vw_bookings AS
SELECT
    b.id,
    b.consignment_no,
    b.sender_name AS sender,
    b.receiver_name AS receiver,
    b.ref_no,
    b.payment_mode,
    b.origin_id,
    o.name AS origin,
    b.destination_id,
    d.name AS destination,
    b.status,
    c.name AS current_location,
    b.comment
FROM
    bookings b
    JOIN locations o ON o.id = b.origin_id
    JOIN locations d ON d.id = b.destination_id
    LEFT JOIN locations c ON c.id = b.current_location_id;

CREATE VIEW vw_manifests AS
SELECT
    m.id,
    m.manifest_no,
    m.date,
    m.status,
    m.origin_id,
    o.name AS origin,
    m.destination_id,
    d.name AS destination
FROM
    manifests m
    JOIN locations o ON m.origin_id = o.id
    JOIN locations d ON m.destination_id = d.id;

`;
        return queryInterface.sequelize.query(sql, {
            type: Sequelize.QueryTypes.RAW,
        });
    },

    async down(queryInterface, Sequelize) {
        const sql = `

drop view vw_bookings;
drop view vw_manifests;
drop table booking_items;
drop sequence booking_items_id_seq;
drop table bookings;
drop sequence bookings_id_seq;
drop table clients;
drop sequence clients_id_seq;
drop table districts;
drop sequence districts_id_seq;
drop table fiscal_years;
drop sequence fiscal_years_id_seq;
drop table locations;
drop sequence locations_id_seq;
drop table manifest_bookings;
drop table manifests;
drop sequence manifests_id_seq;
drop table months;
drop sequence months_id_seq;
drop table rates;
drop sequence rates_id_seq;
drop table users;
drop sequence users_id_seq;
drop table wards;
drop sequence wards_id_seq;

drop type enum_booking_items_unit;
drop type enum_bookings_payment_mode;
drop type enum_bookings_service_type;
drop type enum_bookings_status;
drop type enum_manifests_status;

`;
        return queryInterface.sequelize.query(sql, {
            type: Sequelize.QueryTypes.RAW,
        });
    },
};
