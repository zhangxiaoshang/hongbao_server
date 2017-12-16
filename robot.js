const {Wechaty, Room} = require('wechaty')
const parseString = require('xml2js').parseString;

var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/hongbao', { useMongoClient: true })

var db = mongoose.connection

db.on('open', () => {
    console.log('数据库连接成功')
})

const bot = Wechaty.instance()

bot
.on('scan', (url, code)=>{
    let loginUrl = url.replace('qrcode', 'l')
    require('qrcode-terminal').generate(loginUrl, {small: true})
    console.log(url)
})

.on('login', user=>{
    console.log(`${user} login`)
})

.on('friend', async function (contact, request){
    if(request){
        await request.accept()
        console.log(`Contact: ${contact.name()} send request ${request.hello}`)
    }
})

.on('message', async function(m){
    const contact = m.from()
    const content = m.content()
    const room = m.room()

    if(room){
        // console.log(`Room: ${room.topic()} Contact: ${contact.name()} Content: ${content}`)
    } else{
        // 
        let xml = convertXMLString (content)
        parseString(xml, function (err, result) {
          if (err) {
                // xml转JSON失败
                console.log(`Contact: ${contact.name()} Content: ${content}`)
            } else {
    			// TODO 还要根据解析出来的数据再一次判断是否是分享红包
                insertData(contact.name(), result)
            }
        });

    	// console.log(`Contact: ${contact.name()} Content: ${content}`)
    }

    if(m.self()){
        return
    }

    if(/hello/.test(content)){
        m.say("hello how are you")
    }

    if(/room/.test(content)){
        let keyroom = await Room.find({topic: "test"})
        if(keyroom){
            await keyroom.add(contact)
            await keyroom.say("welcome!", contact)
        }
    }

    if(/out/.test(content)){
        let keyroom = await Room.find({topic: "test"})
        if(keyroom){
            await keyroom.say("Remove from the room", contact)
            await keyroom.del(contact)
        }
    }
})

.init()


/* ******************
*   自定义方法
*********************/

// 将xml字符串中转义符转为xml标签
function convertXMLString (xml) {
	return xml.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/<br\/>/g, '')
}

// 向数据库插入红包数据
function insertData (contributor, data) {
    let appinfo = data.msg.appinfo[0]
    let appmsg = data.msg.appmsg[0]
    if (db.readyState !== 1) {
        console.log('ERROR: 没有连接数据库')
        return
    }
    let type = appinfo.appname[0] === '饿了么' ? 1 : 2;
    let Ticket = require('./models/Ticket.js')
    Ticket.count({ type: type}, (err, count) => {
        if (err) {
            console.log('查询次数出错')
        } else {
            let ticket = new Ticket({
                no: count,
                type: type,
                typename: appinfo.appname[0],
                title: appmsg.title[0],
                url: appmsg.url[0],
                contributor: contributor,
                from: 'personal',
                offer: 0
            })
            ticket.save((err) => {
                if (err) {
                    console.log('保存失败', err)
                } else {
                    console.log('保存成功')
                }
            })
        } 
    })
    
}

