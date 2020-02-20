'use strict';
const https = require('https');
const fs    = require('fs');
const path  = require('path');
const args  = process.argv.slice(2).reduce(function (accumulator, current) {
  let         splittedArgv     = current.replace('--', '').split('=');
  accumulator[splittedArgv[0]] = splittedArgv[1];

  return accumulator;
}, {});

if (!args.port || args.port < 1 || args.port > 65535) {
  console.log("Please provide valid --port argument.");
  return;
}

if (!args.keyPath || !args.certificatePath) {
  console.log("Please provide valid --keyPath and --certificatePath argument's.");
  return;
}

let options = {};

try {
  const key     = fs.readFileSync(path.resolve(__dirname, args.keyPath));
  const cert    = fs.readFileSync(path.resolve(__dirname, args.certificatePath));
        options = { ...options, key, cert };
} catch (error) {
  console.log(`${error.code}. Error has occured while reading ${error.path} file.`);
  return;
}

https.createServer(options, function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('Secure Server Response.');
  res.end();
}).listen(args.port);

console.log(`HTTPS server started on port ${args.port}.`);