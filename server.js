var express = require("express");

var app = express();

// 配置信息
var config = require("./config");
// 文件系统模块
var fs = require("fs");
// url解析模块
var url = require("url");
// 路径解析模块
var path = require("path");
// 引入artTemplate模块
var template = require('art-template');

// 自定义中间件
var catalog = require("./middleware/catalog.js")

app.set('port',process.env.PORT || config.port);

// 设置模板引擎
app.set("views",path.join(__dirname,"views"));
template.defaults.extname = ".html";
app.engine('.html', require("express-art-template"));
app.set("view options",{
	debug:process.env.NODE_ENV !== "production"
})
app.set('view engine', 'html');


// 静态资源
app.use(express.static(config.root));

// 生成目录列表
app.use(catalog);


// 定制404页面
app.use(function(req,res){
	res.render("error",{title:"404 - Not Found"})
});

// 定制500页面
app.use(function(err,req,res,next){
	res.status(500);
	res.render("error",{title:"500 - Server Error"})
})

app.listen(app.get("port"),function(){
	console.log("Express started on http://localhost:"+app.get("port") + "; press Ctrl-C to terminate.")
})