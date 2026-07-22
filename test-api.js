const http = require('http');
const https = require('https');

async function test() {
  const url = 'https://cantu-project-production.up.railway.app/api/v1/user?page=1&limit=100';
  https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log(JSON.parse(data));
    });
  });
}
test();
