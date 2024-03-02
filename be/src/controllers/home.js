import { resetDB, seedTestData } from '@/database/seed/seed';

/**
 * GET /
 * Home page
 */
export const index = (req, res) => res.send('Test successful');

/**
 * GET /health
 * Health check
 */
export const healthCheck = (req, res) => res.json({ success: true });

export const seedDB = (req, res) => {
    try {
        resetDB();
        return res.json('Successfully seeded!');
    } catch (ex) {
        return res.json(ex);
    }
};

export const seedTest = (req, res) => {
    try {
        seedTestData();
        return res.json('Successfully seeded!');
    } catch (ex) {
        return res.json(ex);
    }
};
