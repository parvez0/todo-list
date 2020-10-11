const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/health-check', function(req, res, next) {
  res.publish(true, "Server is ready to accept connections");
});

module.exports = router;
