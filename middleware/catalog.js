// url解析模块
var url = require("url");
// 路径解析模块
var path = require("path");
// 文件系统模块
var fs = require("fs");
// 配置信息
var config = require("../config");

module.exports = function(req,res,next){
	var reqUrl = req.url;
	var pathName = url.parse(reqUrl).pathname;

	// 获取资源文件的本地路径
	var baseRoot = config.root;
	var filePath = path.join(baseRoot,pathName);
	// 如果路径中没有扩展名
	if(path.extname(pathName) === ""){
		// 如果不是以 / 结尾的，加 / 并301重定向
		if(pathName.charAt(pathName.length-1) != "/"){
			pathName += "/";
			var redirect = "http://"+req.headers.host+pathName;
			res.redirect(redirect)
		}
		try{
			// 用户访问目录
			var filedir = filePath.substring(0,filePath.lastIndexOf('\\'));
			// 获取用户访问路径下的文件列表
			var files = fs.readdirSync(filedir);
			res.render("index",{files:files,pathName:pathName})
		}catch(e){
			res.render("error",{title:"您访问的目录不存在"})
		}
	}else{
		next();
	}
}