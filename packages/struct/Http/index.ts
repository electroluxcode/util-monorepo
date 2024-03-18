const net = require('net');

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    const requestString = data.toString();
    
    // 解析HTTP请求
    // const [method, path] = requestString.split(' ')[0, 1];
    
    // 构造HTTP响应
    const response = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\n\r\nHello, World!`;

    // 发送HTTP响应
    socket.write(response, 'utf-8', () => {
      socket.end();
    });
  });
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
