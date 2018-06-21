var express = require("express");
var app = express();
var exec = require('child_process').exec;  // 引用程式庫
var bodyParser = require("body-parser"); 
app.use(bodyParser.urlencoded({ extended: true }));// 接受任何值
var multer = require('multer');
var cookieParser = require('cookie-parser');
var fs = require('fs');
//------------------------------- ^ httpserver所需模組
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/LILY');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
//------------------------------^ mongoose 模組
app.set('view engine', 'ejs');
app.use(express.static('public'));//提供靜態檔案
app.use(cookieParser());
var userSchema = new mongoose.Schema({ //帳號資訊
    name:String,
	account:String,
	password:String,
	email:String,
	point:Number
	});
var usersModel = db.model('users',userSchema); //users模型

var itemSchema = new mongoose.Schema({ //帳號資訊
	id:String,
	name:String,
	price:Number,
	type:String,
	pic:String,
	number:Number,
	local_x:Number,
	local_y:Number,
	note:String
	});
var itemModel = db.model('item',itemSchema); //users模型
//-----------------------------^資料集綱要、模型宣告
var storage = multer.diskStorage({ destination: function (req, file, cb) {
cb(null, 'public//img'); // 保存的路徑，備註：需要自己創建
}, filename: function (req, file, cb) { // 將保存文件名設置為 欄位名 + 時間戳，比如 logo-1478521468943

cb(null,  'pic'+ '.png' );
}
});// 通過 storage 選項來對 上傳行為 進行定製化
var upload = multer({ storage: storage })// 單圖上傳
//---------------------------------------------------

db.once('open', function callback () {									
	/*var users = new usersModel({name:'Zack',phone:'0930082454'});
	users.save();*/
	console.log("Database Connected.");
});
//-------------------------------^ db連線成功時動作
var port =8080;
app.listen(port, function(req, res) { //Server 8080port
	console.log("網站伺服器在"+port+"埠口開工了！");
});


//--------------------會員登入-------------------------  ---OK
app.post('/signin',function(req,res){ 
	var account = req.body.account; 
	var password = req.body.password;
	
	usersModel.findOne({account:account},function(err,docs){ //取得登入帳號資訊	
		if(docs!=null){ //判斷是否有找到東西
			 if(docs.account!=account || docs.password!=password){ //檢查帳號密碼是否錯誤
				console.log('帳號或密碼錯誤，請重新輸入');
				res.end('帳號或密碼錯誤，請重新輸入');
			}else{
				if(account=='admin'){
					res.cookie('isLogin','true',{ maxAge: 60000});
					itemModel.find({},function(err,docs){// 搜尋是否重複註冊
						docs=JSON.stringify(docs);
						if(err){
							console.log('存取錯誤，請重試。');
							res.end('存取錯誤，請重試。');
						}
						else if(docs == '[]')//無資料
						{		
							console.log('目前無商品');
							res.end('目前無商品');
					
						}
						else{//有資料
							data = JSON.parse(docs);
							res.render('admin', {
							title: 'MyAppName',
							data:data});
						}
				});
				}else{
					itemModel.find({},function(err,docs){// 搜尋是否重複註冊
						docs=JSON.stringify(docs);
						if(err){
							console.log('存取錯誤，請重試。');
							res.end('存取錯誤，請重試。');
						}
						else if(docs == '[]')//無資料
						{		
							console.log('目前無商品');
							res.end('目前無商品');
					
						}
						else{//有資料
							data = JSON.parse(docs);
							res.render('login', {
							title: 'MyAppName',
							data:data});
						}
					});					
				}
			}
		}else{
			console.log('無此帳號');
			res.end('無此帳號');
		}
	});
	
});
//--------------------^會員登入------------------

//--------------------會員註冊----------------------------OK
app.post('/signup',function(req,res){ 
  var name=req.body.name; //POST變數值
  var account = req.body.account;
  var password = req.body.password;
  var point = req.body.point;
  var email = req.body.email;
  function signup(){ //帳號註冊function
  var users = new usersModel({
	name:name,
	account:account,
	email:email,
	point:point,
	password:password
  });
  users.save();// 存帳號註冊資訊
  }
  
  usersModel.find({account:account},function(err,docs){// 搜尋是否重複註冊
	docs=JSON.stringify(docs);
	if(err){
		console.log('存取錯誤，請重試。');
		res.end('存取錯誤，請重試。');
	}
	else if(docs == '[]')
	{
		console.log('帳號註冊成功');
		res.redirect('/');
		res.end('帳號註冊成功');
		signup();
	}
	else {
		console.log('帳號已被註冊');
		res.end('帳號已被註冊');
	}
  });
});
//--------------------^會員註冊------------------------


//--------------------更改密碼-------------------------- ---OK
app.post('/changepwd',function(req,res){ 
	var account = req.body.account; 
	var oldpassword = req.body.oldpassword;
	var newpassword = req.body.newpassword;
	
	usersModel.findOne({account:account},function(err,docs){ //取得欲改密碼之帳號資訊
		if(err){
			console.log('存取錯誤，請重試。');
			res.end('存取錯誤，請重試。');}
		if (docs!=null)//判斷是否有找到東西
		{
			if (docs.password==oldpassword){
				usersModel.update({account:account},{$set:{password:newpassword}},function(err){ //更新密碼
					if(err){
						console.log(err);
						console.log('更改密碼發生錯誤，請重試。');
						res.end('更改密碼發生錯誤，請重試。');
						}//檢查是否更新失敗
					else{
						console.log('密碼更改完成');
						res.end('密碼更改完成');
					}
				});
			}else{
				console.log('舊密碼輸入錯誤，請重新輸入。');
				res.end('舊密碼輸入錯誤，請重新輸入。');
			}
		}else{
			console.log('無此帳號');
			res.end('無此帳號');
			}
	});
	
	
});
//--------------------^更改密碼-------------------------
app.post('/additem',upload.single('pic'), function(req, res){ 
	var id = req.body.id;
	var name = req.body.name;
	var price = req.body.price;
	var type = req.body.type;
	var pic = req.body.pic;
	var number = req.body.number;
	var local_x = req.body.local_x;
	var local_y = req.body.local_y;
	var note = req.body.note;
	itemModel.find({id:id},function(err,docs){// 搜尋是否重複註冊
		docs=JSON.stringify(docs);
		if(err){
			//console.log(err);
			console.log('存取錯誤，請重試。');
			res.end('存取錯誤，請重試。');
		}
		else if(docs == '[]')
		{	
			var item = new itemModel({
				id:id,
				name:name,
				price:price,
				type:type,
				pic:pic,
				number:number,
				local_x:local_x,
				local_y:local_y,
				note:note
			});
			item.save();// 		
			fs.mkdir('public/img/'+id,function(){});
			fs.rename('./public/img/pic.png', './public/img/'+id+'/pic.png', function (err) {
				if (err) throw err;
					console.log('存檔完成');
				});
			console.log('商品添加成功');
			res.redirect('/');
			res.end('商品添加成功');
			
		}
		else {
			console.log('商品ID重複');
			res.end('商品ID重複');
		}
  });
});

app.post('/edititem',upload.single('pic'), function(req, res){ 
	var id = req.body.id;
	var name = req.body.name;
	var price = req.body.price;
	var type = req.body.type;
	var pic = req.body.pic;
	var number = req.body.number;
	var local_x = req.body.local_x;
	var local_y = req.body.local_y;
	var note = req.body.note;
	itemModel.update({id:id},{$set:{name:name,price:price,type:type,number:number,local_x:local_x,local_y:local_y,note:note}},function(err){ //編輯商品
		if(err){
			console.log(err);
		}
		fs.rename('./public/img/pic.png', './public/img/'+id+'/pic.png', function (err) {
			if (err){ 
				console.log(err);
			}else{
				console.log('存檔完成');
			}
			});
		console.log('商品編輯完成');
		res.redirect('/');
		res.end('商品編輯完成');
  });
});
app.get('/signin',function(req,res){  
	res.sendFile(__dirname + '/www/signin.html');
});
app.get('/signup',function(req,res){  
	res.sendFile(__dirname + '/www/signup.html');
});
app.get('/additem',function(req,res){  
	res.sendFile(__dirname + '/www/additem.html');
});
app.get('/index',function(req,res){  
	res.sendFile(__dirname + '/www/index.html');
});
app.get('/', function (req, res) {
	if(req.cookies.isLogin){
		itemModel.find({},function(err,docs){// 搜尋是否重複註冊
			docs=JSON.stringify(docs);
			if(err){
				console.log('存取錯誤，請重試。');
				res.end('存取錯誤，請重試。');
			}
			else if(docs == '[]')//無資料
			{		
				console.log('目前無商品');
				res.end('目前無商品');
					
			}
			else{//有資料
				data = JSON.parse(docs);
				res.render('admin', {
					title: 'MyAppName',
					data:data
				});
			}
		  });
	}else{
		itemModel.find({},function(err,docs){// 搜尋是否重複註冊
			docs=JSON.stringify(docs);
			if(err){
				console.log('存取錯誤，請重試。');
				res.end('存取錯誤，請重試。');
			}
			else if(docs == '[]')//無資料
			{		
				console.log('目前無商品');
				res.end('目前無商品');
					
			}
			else{//有資料
				data = JSON.parse(docs);
				res.render('index', {
					title: 'MyAppName',
					data:data
				});
			}
			});	
	}
});
app.get('/removeitem', function (req, res) {
	var id = req.query.id;
	itemModel.remove({id:id},function(err){
		console.log('刪除完畢');
		res.redirect('/');
		res.end('刪除完畢');
		});
});
app.get('/getitem',function(req,res){  
	var id = req.query.id;
	itemModel.findOne({id:id},function(err,docs){// 搜尋是否重複註冊
		docs=JSON.stringify(docs);
		if(err){
			console.log('存取錯誤，請重試。');
			res.end('存取錯誤，請重試。');
		}
		else if(docs == '[]')//無資料
		{		
			console.log('目前無商品');
			res.end('目前無商品');
				
		}
		else{//有資料
			//data = JSON.parse(docs);
			console.log(docs);
			res.end(docs);
		}
	  });
});

app.get('/edititem', function (req, res) {
	var id = req.query.id;
	console.log(id);
	itemModel.findOne({id:id},function(err,docs){// 搜尋是否重複註冊
		docs=JSON.stringify(docs);
		if(err){
			console.log('存取錯誤，請重試。');
			res.end('存取錯誤，請重試。');
		}
		else if(docs == '[]')//無資料
		{		
			console.log('目前無商品');
			res.end('目前無商品');
				
		}
		else{//有資料
			data = JSON.parse(docs);
			console.log(data);
			res.render('edititem', {
				title: '編輯商品',
				data:data
			});
		}
	  });
});
app.get('/logout', function (req, res) {
	res.clearCookie('isLogin', null)

});
app.get('/test', function (req, res) {
	
	

 
});