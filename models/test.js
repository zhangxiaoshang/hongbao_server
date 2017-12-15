var mongoose = require('mongoose')
var Ticket = require('./hongbao.js')

mongoose.connect('mongodb://localhost/ele', { useMongoClient: true })
var db = mongoose.connection

db.on('open', () => {
	console.log('opened')

	Ticket.find({}, 'type typename title contributor from offer createtime', { skip: 0, limit: 1 }, (err, docs) => {
		console.log(docs)
	})
})
