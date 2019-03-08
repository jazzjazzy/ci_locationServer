var WebSocketServer = require("ws").Server;
var wss1 = new WebSocketServer({port:3000});
var wss2 = new WebSocketServer({port:3001});
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

console.log("starting");


mongoose.connect('mongodb://mongo:27017/Location', { useNewUrlParser: true })
    .catch( err => {
        console.log(err);
    });

const Drivers = require('./models/Drivers');

function noop() {}

function heartbeat() {
  this.isAlive = true;
}

wss1.on("connection", function(ws){
    ws.isAlive = true;
    ws.on('pong', heartbeat);
    ws.on('message', function incoming(payload){
        if(payload !== ''){
            console.log(payload);
            let data = JSON.parse(payload);
            let id = consumeMeassage(data, ws);
            if(data.token == undefined){
                data.token = id;
            } 
            console.log(id);
            wss2.clients.forEach(function each(client) {
                client.send(JSON.stringify(data));
            });
        }else{
            console.log(payload);
        }
    });
});

wss2.on("connection", function(ws){
    ws.on('message', function incoming(payload){
        if(payload !== ''){
            console.log(payload);
            ws.send("connected");        
        }
    });
});

wss1.on("exit", function(w){
    terminator();
});

function consumeMeassage(data, ws){
    // if we have a token then lets update
    if(typeof data.token !== 'undefined'){
        Drivers.updateOne(
            { _id: data.token },
            { coordinates: {
                latitude: data.lat,
                longitude: data.lon,
            },
        }).then(result => {
            console.log(result);
            ws.send(data.token);
            
        })
        .catch(err => {
            console.log(err);
        });
        return data.token;
    }else{ //else lets insert
        const driver = new Drivers({
        _id: mongoose.Types.ObjectId(),
        name: data.name,
            coordinates: {
                latitude: data.lat,
                longitude: data.lon,
            },
        });
        driver.save()
        .then(result => {
            console.log(result.id);
            ws.send(result.id);
            return result.id;
            
        })
        .catch(err => {
            console.log(err);
        });
        return driver._id;
    }
    
}

const interval = setInterval(function ping() {
    wss1.clients.forEach(function each(ws) {
        if (ws.isAlive === false) return ws.terminate();

        ws.isAlive = false;
        ws.ping(noop);
    });
  }, 300);


function terminator(sig) 
{
  if (typeof sig === "string") 
  {
    Drivers.deleteMany({}, function(err){
        console.log('err');
    })
      
        
    console.log("cleaning db...");
    console.log('Received %s - terminating Node server ...', sig);
    process.exit(1);
  };
  console.log('Node server stopped.');
};

function terminatorSetup(element, index, array) 
{
  process.on(element, function() { terminator(element); });
};

['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT', 'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGPIPE', 'SIGTERM'].forEach(terminatorSetup);
 

