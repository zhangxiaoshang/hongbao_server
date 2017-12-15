var mongoose = require('mongoose');
mongoose.Promise = global.Promise

var Schema = mongoose.Schema;
// 模版
var ticketSchema = new Schema({
	type: Number,
	typename: String,
	title: String,
	url: String,
	contributor: String,
	from: String,
	offer: Number,
	createtime: { type: Date, default: Date.now }
})
// 模型
module.exports = mongoose.model('Tickets', ticketSchema)


