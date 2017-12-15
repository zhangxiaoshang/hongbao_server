// var MongoClient = require('mongodb').MongoClient;
// var DB_CONN_STR = 'mongodb://localhost:27017/ele';
var mongoose = require('mongoose')
var TicketModel = require('../models/Ticket')

mongoose.connect('mongodb://localhost/ele', { useMongoClient: true })
var db = mongoose.connection

class Ticket {
	constructor () {
		console.log('this is Ticket controller')
	}

	show (success) {
		if (db.readyState !== 1) {
			console.log('数据库未连接')
			return
		} else {
			TicketModel.find({}, 'type typename title contributor from offer createtime', { skip: 0, limit: 2 }, (err, docs) => {
				success(docs)
			})
		}		
	}
}

module.exports = Ticket