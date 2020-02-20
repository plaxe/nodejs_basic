const https    = require('https');
const minimist = require('minimist');
const fs       = require('fs');

const { port, keyPath, certificatePath } = minimist(process.argv.slice(2), { number: 'port', string: 'keyPath', string: 'certificatePath' });

if (!port || !(port >= 1 && port <= 65535)) {
  console.log("Please provide --port argument.");
  return;
}

if (!keyPath || !certificatePath) {
  console.log("Please provide --keyPath and --certificatePath argument's.");
  return;
}

let options = {};

try {
  const key     = fs.readFileSync(keyPath);
  const cert    = fs.readFileSync(certificatePath);
        options = { ...options, key, cert };
} catch (error) {
  console.log(`${error.code}. Error has occured while reading ${error.path} file.`);
  return;
}

https.createServer(options, function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('Secure Server Response.');
  res.end();
}).listen(port);

console.log(`HTTPS server started on port ${port}`);