var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/hongbao', {useMongoClient: true })

var db = mongoose.connection
var Ticket = require('./Ticket')


db.on('open', () => {
    console.log('数据库已连接')

    for (let i = 0; i < 100; i++) {
        let ticket = new  Ticket({
            no: i,
            type: 1,
            typename: '饿了么',
            title: '测试红包，第6个红包最大',
            url: 'xiaoshang.online',
            contributor: 'bolingboling',
            from: 'personal',
            offer: 0
        })

        ticket.save(err => {
            if (err) {
                console.log('数据写入失败', err)
            } else {
                console.log(`第${i}条数据写入成功`)
            }
        })
        
    }

})

