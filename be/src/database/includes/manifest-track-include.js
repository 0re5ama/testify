import db from '@/database';

const manifestTrackInclude = (as = 'manifest') => ({
    model: db.models.manifest,
    as,
    attributes: ['date', 'dispatchedAt', 'receivedAt', 'status'],
    include: [
        {
            model: db.models.user,
            include: {
                model: db.models.location,
                attributes: ['name'],
            },
            as: 'receivedBy',
            attributes: ['firstName', 'lastName'],
        },
        {
            model: db.models.masterManifest,
            as: 'masterManifests',
            include: [
                {
                    model: db.models.location,
                    as: 'origin',
                    attributes: ['name'],
                },
                {
                    model: db.models.location,
                    as: 'destination',
                    attributes: ['name'],
                },
                {
                    model: db.models.user,
                    include: {
                        model: db.models.location,
                        attributes: ['name'],
                    },
                    as: 'createdBy',
                    attributes: ['firstName', 'lastName'],
                },
                {
                    model: db.models.user,
                    include: {
                        model: db.models.location,
                        attributes: ['name'],
                    },
                    as: 'dispatchedBy',
                    attributes: ['firstName', 'lastName'],
                },
                {
                    model: db.models.user,
                    include: {
                        model: db.models.location,
                        attributes: ['name'],
                    },
                    as: 'receivedBy',
                    attributes: ['firstName', 'lastName'],
                },
            ],
        },
    ],
});

export default manifestTrackInclude;
