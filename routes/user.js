const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');

router.get("/details", auth, (req, res) => {
	res.status(200).json({ message: "user authenticated." });
});

module.exports = router;