const {Wechaty, Room} = require('wechaty')
const parseString = require('xml2js').parseString;

var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/ele';

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
        console.log(`Room: ${room.topic()} Contact: ${contact.name()} Content: ${content}`)
    } else{
    	// let urlReg = /&lt;url&gt;(.+)&lt;\/url&gt;/i
    	// let url = (urlReg.exec(content)[1]).replace(/amp;/g, '').replace('hardware_id', 'from=singlemessage#hardware_id')
    	let xml = convertXMLString (content)

    	parseString(xml, function (err, result) {
    		if (err) {
    			console.log(`Contact: ${contact.name()} Content: ${content}`)
    		} else {
    			let appinfo = result.msg.appinfo[0]
    			let appmsg = result.msg.appmsg[0]

    			let data = {
    				type: appinfo.appname[0] === '饿了么' ? 1 : 2,
    				typename: appinfo.appname[0],
    				title: appmsg.title[0],
    				url: appmsg.url[0],
                    contributor: contact.name(),
                    from: 'personal',
                    offer: 0,
                    createtime: Date.now()
                }
    			// TODO 还要根据解析出来的数据再一次判断是否是红包分享

                // 向数据库插入红包数据
                saveHongbao(data)
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

/*****************************
* 将红包数据存储到数据库 begin
******************************/
function insertData (data, db, callback) {  
    //连接到表 site
    var collection = db.collection('hongbao');
    //插入数据
    collection.insert(data, function(err, result) { 
        if(err) {
            console.log('Error:'+ err);
            return;
        } else {
            callback(result);
        }     
    });
}

function saveHongbao (data) {
    MongoClient.connect(DB_CONN_STR, function(err, db) {
        if (err) throw err
        console.log("连接成功！");
        insertData(data, db, function(result) {
            console.log(result);
            db.close();
        });
    });
}

/***************************
* 将红包数据存储到数据库 end
****************************/

