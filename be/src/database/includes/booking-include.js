import db from '@/database';

const bookingInclude = (as = 'booking', includeItems = false) => ({
    model: db.models.booking,
    as,
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
        includeItems
            ? {
                  model: db.models.bookingItem,
                  as: 'items',
                  attributes: ['id', 'piece', 'weight', 'desc', 'descTrunc'],
              }
            : null,
    ].filter((x) => x),
});

export default bookingInclude;
