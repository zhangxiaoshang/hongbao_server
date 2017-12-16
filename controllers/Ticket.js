// var MongoClient = require('mongodb').MongoClient;
// var DB_CONN_STR = 'mongodb://localhost:27017/ele';
var mongoose = require('mongoose')
var TicketModel = require('../models/Ticket')

mongoose.connect('mongodb://localhost/hongbao', { useMongoClient: true })
var db = mongoose.connection

class Ticket {
	constructor () {
		console.log('this is Ticket controller')
	}

	show (page, success) {
		if (db.readyState !== 1) {
			console.log('数据库未连接')
			return
		} else {
			let perpage = 10;
			let skip = (page - 1) * perpage
			TicketModel.find({}, 'no type typename title contributor from offer createtime', { skip: skip, limit: perpage }, (err, docs) => {
				success(docs)
			})
		}		
	}
}

module.exports = Ticket