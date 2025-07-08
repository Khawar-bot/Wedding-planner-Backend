import http from 'http';

http.createServer((req, res) => {
  res.end('Hello world');
}).listen(5000, '127.0.0.1', () => {
  console.log('Test server running at http://127.0.0.1:5000');
});
