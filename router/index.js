var express = require('express');
var router = express.Router();

// post
router.use(express.urlencoded({
	extended: true
}));

router.get('/', function (req, res) {
	res.render('index');
});

module.exports = router;
