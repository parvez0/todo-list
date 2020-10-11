const express = require('express');
const router = express.Router();

const { signup, verifyUser } = require('../models/user');
const auth = require('../middlewares/auth');

/**
 * sing-up as end user with personalised experience
 */
router.post('/sign-up', async (req, res) => {
    try {
        const { fullName, email, number, password } = req.body;
        if (!fullName || !email || !number || !password) {
            return res.publish(false, 'Request body malformed', { message: 'One or more required parameters not provided' }, 400);
        }
        const token = await signup(req.body);
        return res.publish(true, 'Login success', { token, type: 'Bearer' }, 201, { name: 'TXID', value: token });
    } catch (e) {
        return res.publish(false, 'Failed', { message: e.message }, e.statusCode());
    }
});

/**
 * login user generates auth jwt token
 */
router.post('/login', async (req, res) => {
    try {
        const { usernameOrEmail, password } = req.body;
        if (!usernameOrEmail || !password) {
            return res.publish(false, 'Request body malformed', { message: 'One or more required parameters not provided' }, 400);
        }
        const token = await verifyUser(usernameOrEmail, password);
        return res.publish(true, 'Login success', { token, type: 'Bearer' }, 200, { name: 'TXID', value: token });
    } catch (e) {
        return res.publish(false, 'Failed to login', { message: e.message }, e.statusCode ? e.statusCode() : 500);
    }
});

/**
 * verify user session
 */
router.get('/refresh', auth, async (req, res) => {
   res.publish(true, 'session is valid');
});

module.exports = router;
