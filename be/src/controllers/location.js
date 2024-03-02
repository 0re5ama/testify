import db from '@/database';
import paymentMode from '@/database/enums/payment-mode';

export const get = async (req, res, next) => {
    const userLocationId = req.user.locationId;
    console.log(userLocationId);
    try {
        const list = await db.models.location.findAndCountAll({
            order: [['id', 'ASC']],
            include: [
                {
                    model: db.models.district,
                    attributes: ['id', 'name'],
                },
                {
                    model: db.models.rate,
                    attributes: ['id', 'destinationId', 'rate'],
                    where: { destinationId: userLocationId },
                    required: false,
                    as: 'originRates',
                },
                {
                    model: db.models.rate,
                    attributes: ['id', 'originId', 'rate'],
                    where: { originId: userLocationId },
                    required: false,
                    as: 'destinationRates',
                },
            ],
        });

        const response = {
            ...list,
            rows: list.rows.map((x) => ({
                ...x.dataValues,
                rate: [...x.originRates, ...x.destinationRates][0]?.rate,
            })),
        };
        return res.json(response);
    } catch (err) {
        return next(err);
    }
};

export const create = async (req, res, next) => {
    try {
        const location = await db.models.location.create(req.body);
        return res.status(201).json(location);
    } catch (err) {
        return next(err);
    }
};

export const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const location = await db.models.location.update(req.body, {
            where: { id },
        });
        return res.status(201).json(location);
    } catch (err) {
        return next(err);
    }
};

export const getClients = async (req, res, next) => {
    try {
        const { id } = req.params;

        const list = await db.models.client.findAndCountAll({
            where: { locationId: id },
            order: [['id', 'ASC']],
        });

        return res.json(list);
    } catch (err) {
        return next(err);
    }
};

export const getBookings = async (req, res, next) => {
    try {
        const { id } = req.params;

        const list = await db.models.booking.findAndCountAll({
            where: { currentLocationId: id },
            order: [['id', 'ASC']],
            include: [
                {
                    model: db.models.bookingItem,
                    as: 'items',
                    attributes: ['id', 'piece', 'weight', 'desc'],
                },
                {
                    model: db.models.location,
                    as: 'origin',
                    attributes: ['id', 'name'],
                },
                {
                    model: db.models.location,
                    as: 'destination',
                    attributes: ['id', 'name'],
                },
            ],
        });

        const response = {
            ...list,
            rows: list.rows.map((x) => ({
                ...x.dataValues,
                paymentModeName: paymentMode[x.paymentMode]?.label,
                items: undefined,
                piece: x.items.reduce((a, b) => a + +b.piece, 0),
                weight: x.items.reduce((a, b) => a + +b.weight, 0),
                desc: x.items[0].desc, // TODO: combine if more, else show first only
            })),
        };

        return res.json(response);
    } catch (err) {
        return next(err);
    }
};
