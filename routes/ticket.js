var express = require('express');
var router = express.Router();

var Ticket = require('../controllers/Ticket.js')
var ticket = new Ticket()

/* GET hongbaos listing */
router.get('/', function (req, res, next) {
	let page = req.query.page
	if (page < 1) {
		res.json({
			status: 'error',
			msg: '参数page不能小于0'
		})
	} else {
		ticket.show(page, (result) => {
			res.json({
				status: 'success',
				msg: '成功获取红包数据',
				result: {
					page: 1,
					perpage: result.length,
					data: result
				}
			})
		})
	}
	
})


module.exports = router;
