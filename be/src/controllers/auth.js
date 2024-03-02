import createError from 'http-errors';

import db from '@/database';

/**
 * GET /auth
 * Auth check request
 */
export const auth = async (req, res, next) => {
    try {
        const { id: userId } = req.user || {};
        if (!userId) {
            return next(createError(401, 'Not authenticated!'));
        }

        // Find user by email address
        const user = await db.models.user.findOne({
            where: { id: userId },
            include: {
                model: db.models.location,
                attributes: ['id', 'name'],
            },
        });
        if (!user) {
            return next(createError(401, 'Not authenticated!'));
        }

        delete user.password;
        return res.status(200).json(user);
    } catch (err) {
        return next(err);
    }
};

/**
 * POST /auth/login
 * Login request
 */
export const login = async (req, res, next) => {
    try {
        const { userName, password } = req.body;

        // Find user by username
        const user = await db.models.user.findOne({ where: { userName } });

        if (!user) {
            return next(
                createError(400, 'There is no user with this User Name!'),
            );
        }

        // Check user password
        const isValidPassword = await user.validatePassword(password);
        console.log('pass: ', password);
        if (!isValidPassword) {
            return next(createError(400, 'Incorrect password!'));
        }

        // Generate and return token
        const token = user.generateToken();
        const refreshToken = user.generateToken('8h');
        return res.status(200).json({ token, refreshToken });
    } catch (err) {
        conosole.log(err);
        return next(err);
    }
};

/**
 * POST /auth/register
 * Register request
 */
export const register = async (req, res, next) => {
    try {
        // Create user
        const user = await db.models.user.create(req.body);

        // Generate and return tokens
        const token = user.generateToken();
        const refreshToken = user.generateToken('2h');
        res.status(201).json({ token, refreshToken });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /auth/me
 * Get current user
 */
export const getCurrentUser = async (req, res, next) => {
    try {
        delete req.user.dataValues.password;
        res.json(req.user);
    } catch (err) {
        next(err);
    }
};

/**
 * PUT /auth/me
 * Update current user
 */
export const updateCurrentUser = async (req, res, next) => {
    try {
        await req.user.update(req.body, {
            fields: [
                'firstName',
                'middleName',
                'lastName',
                'email',
                'phone',
                'status',
                'wardId',
            ],
        });
        res.status(200).json({ success: true });
    } catch (err) {
        next(err);
    }
};

/**
 * DELETE /auth/me
 * Delete current user
 */
export const deleteCurrentUser = async (req, res, next) => {
    try {
        await req.user.destroy();
        const user = await db.models.user.create(req.body);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

/**
 * PUT /auth/me/password
 * Update password of current user
 */
export const updatePassword = async (req, res, next) => {
    try {
        const { current, password } = req.body;

        // Check user password
        const isValidPassword = await req.user.validatePassword(current);
        if (!isValidPassword) {
            return next(createError(400, 'Incorrect password!'));
        }

        // Update password
        req.user.password = password;
        await req.user.save();

        return res.json({ success: true });
    } catch (err) {
        return next(err);
    }
};

/**
 * PUT /auth/reset-password
 * Update password of any user
 */
export const resetPassword = async (req, res, next) => {
    try {
        const { id, password } = req.body;

        const user = await db.models.user.findByPk(id).catch(() => null);
        // Update password
        user.password = password;
        await user.save();

        return res.json({ success: true });
    } catch (err) {
        return next(err);
    }
};
