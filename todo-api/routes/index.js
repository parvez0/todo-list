const express = require('express');
const router = express.Router();

router.get('/health-check', (req, res) => {
  res.publish(true, "Server is ready to accept connections");
});

module.exports = router;
