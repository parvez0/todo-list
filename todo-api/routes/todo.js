const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');

router.get('/list', auth, (req, res) => {
    res.publish(true, "Server is ready to accept connections");
});

router.post('/create', auth, async (req, res) => {

});

router.delete('/:id', auth, async (req, res) => {

});

module.exports = router;
