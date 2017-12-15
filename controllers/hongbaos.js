var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/ele';

class HongBao {
	constructor () {
		console.log('this is hongbao controller')
	}

	getHongbaoList (success) {
		MongoClient.connect(DB_CONN_STR, (err, db) => {
			if (err) throw err
				selectData(db, function(result) {
				success(result)
				db.close();
			});
		});

		let selectData =function (db, callback) {  
  			//连接到表  
  			var collection = db.collection('hongbao');
  			//查询数据
  			collection.find().toArray(function(err, result) {
  				if(err) {
  					console.log('Error:'+ err);
  				} else {
  					callback(result);    	
  				}     
  			});
  		}		
	}

	// selectData (db, callback) {  
 //  		//连接到表  
 //  		var collection = db.collection('hongbao');
 //  		//查询数据
 //  		collection.find().toArray(function(err, result) {
 //  			if(err) {
 //  				console.log('Error:'+ err);
 //  			} else {
 //  				callback(result);    	
 //  			}     
 //  		});
 //  	}
}

module.exports = HongBao