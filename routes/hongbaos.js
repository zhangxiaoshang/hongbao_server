var express = require('express');
var router = express.Router();

var HongbaoCtrl = require('../controllers/hongbaos.js')

/* GET hongbaos listing */
router.get('/', function (req, res, next) {
	let hongbao = new HongbaoCtrl()
	hongbao.getHongbaoList((result) => {
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
