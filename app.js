var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var url = require('url');
var path = require('path'); 
var fs = require('fs');  

app.get('/', function(req, res){
    res.sendfile('index.html');
});

//监听当有一个客户端连接上以后处理
io.on('connection', function(socket){
    console.log('一个用户端连接上 ' + socket);
    socket.on('disconnect', function(){
        console.log('一个用户断开连接');
    });
    socket.on('chat', function(msg){
        console.log('消息: ' + msg);
        io.emit('chat', msg);
    });
});

//处理静态文件
app.all('/*.(html|css|js|jpg|png){1}', function(req, res, next){
    var realpath = __dirname + '/static' + url.parse(req.url).pathname;
    console.log('realpath:' + realpath);
    if(path.existsSync(realpath)){
        res.end(fs.readFileSync(realpath));
    }else {
        res.end('Cannot find request url: ' + req.url);
    }
});

http.listen(3000, function(){
    console.log('监听端口:3000');
});