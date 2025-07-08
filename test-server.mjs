import http from 'http';

const server = http.createServer((req, res) => {
  res.end('Hello from test server!');
});

server.listen(5000, '127.0.0.1', () => {
  console.log('Server running at http://127.0.0.1:5000');
});
