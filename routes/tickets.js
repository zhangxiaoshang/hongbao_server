var express = require('express');
var router = express.Router();

var Ticket = require('../controllers/Ticket.js')
var ticket = new Ticket()

/* GET hongbaos listing */
router.get('/', function (req, res, next) {
	ticket.show((result) => {
		res.json({
			status: 'success',
			msg: '成功获取红包数据',
			result: {
				count: result.length,
				data: result
			}
		})
	})
})


module.exports = router;
