// 引入ws库
const WebSocket = require("ws");

// 创建一个WebSocket服务器，监听3000端口
const wss = new WebSocket.Server({ port: 3000 ,
  perMessageDeflate: {
    zlibDeflateOptions: {
      // 设置 zlib 压缩级别
      chunkSize: 1024,
      memLevel: 7,
      level: 3 // 压缩级别：0-9 (0: 无压缩, 9: 最大压缩)
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024
    },
    // 客户端请求压缩时才进行压缩
    clientNoContextTakeover: true, // 不复用客户端上下文
    serverNoContextTakeover: true, // 不复用服务器上下文
    serverMaxWindowBits: 10,       // 压缩窗口大小
    concurrencyLimit: 10,          // 同时压缩的请求数
    threshold: 1024                // 最小压缩字节数，小于此值不压缩
  }
});


// 当客户端连接时
wss.on("connection", (ws) => {
  console.log("客户端已连接");

  // 当接收到客户端的消息时
  ws.on("message", (message) => {
    ws.send(message)
    console.log("收到消息: %s", message);

    // if(message == '1'){
    // }else{
    //    // 将收到的消息发送回客户端
    // ws.send(`服务器: 收到消息，内容是 ${message}`);
    // }
   
  });

  // 当连接关闭时
  ws.on("close", () => {
    console.log("客户端已断开连接");
  });

  // 模拟发送消息到客户端
  // ws.send("欢迎连接到WebSocket服务器！");
  // setInterval(() => {
  //   ws.send(Math.random());
  // }, 1000);

});

wss.on("headers", (headers, req) => {
  // 设置支持的协议
  const protocols = req.headers["sec-websocket-protocol"];
  const supportedProtocols = ["protocolB", "protocolD"];
  const selectedProtocol = protocols
      ? protocols.split(",").map(p => p.trim()).find(p => supportedProtocols.includes(p))
      : null;

  if (selectedProtocol) {
    console.log("headers push Sec-WebSocket-Protocol " + selectedProtocol);
      // headers.push(`Sec-WebSocket-Protocol: ${selectedProtocol}_selected`);
  }
   const originPerMessageDeflate = req.headers["Sec-WebSocket-Extensions"];
   console.log("originPerMessageDeflate " + originPerMessageDeflate);

   for(var key in req.headers){
    console.log( 'all  headers   ' + key, req.headers[key])
   }

});


console.log("WebSocket服务器正在监听3000端口...");
