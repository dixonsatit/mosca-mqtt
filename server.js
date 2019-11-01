require('dotenv').config();
var mosca = require('mosca');

  var SECURE_KEY = __dirname + '/secure/key.pem';
  var SECURE_CERT = __dirname + '/secure/cert.pem';
  
  var settings = {

    logger: {
      name: "mqtt",
      level: 'info',
    },
    interfaces: [
        { type: "mqtt", port: +process.env.MQTT_PORT },
        { type: "mqtts", port: +process.env.MQTTS_PORT, credentials: { keyPath: SECURE_KEY, certPath: SECURE_CERT } },
        { type: "http", port: +process.env.HTTP_PORT, bundle: true },
        { type: "https", port: +process.env.HTTPS_PORT, bundle: true, credentials: { keyPath: SECURE_KEY, certPath: SECURE_CERT } }
    ]
  };
  var server = new mosca.Server(settings);
  server.on('ready', setup);

  var authenticate = function(client, username, password, callback) {
    let user = process.env.USERNAME;
    let pass = process.env.PASSWORD;
    var authorized = (username === user && password.toString() === pass);
    if (authorized) client.user = username;
    callback(null, authorized);
  }
  
  // fired when the mqtt server is ready
  function setup() {
    server.authenticate = authenticate;
  }

  server.on('clientConnected', function (client) {
    console.log('Client Connected:', client.id);
  });
  
  server.on('clientDisconnected', function (client) {
    console.log('Client Disconnected:', client.id);
  });
  
  server.on('published', function (packet, client) {
    console.log(packet);
    console.log('Published', packet.payload.toString());
  });