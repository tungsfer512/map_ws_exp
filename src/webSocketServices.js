const url = require('url');

const webSocketServices = (wss) => {
    let vehicles = {};
    let admins = {};
    wss.on('connection', function connection(ws, req) {
        console.log('A new client connected');
        const parameters = url.parse(req.url, true);
        let id = parameters.query.id;
        console.log(id);
        if (id[0] == 'v') {
            id = id.substr(id.length - 1);
            // ws.id = id;
            vehicles[id] = ws;
        }
        if (id[0] == 'a') {
            id = id.substr(id.length - 1);
            admins[id] = ws;
        }
        ws.on('message', function (message) {
            console.log(message);
            var messageArray = JSON.parse(message);
            let gps = messageArray['id'].substr(0, 3);
            if (gps == 'gps') {
                let gpsID = messageArray['id'].substr(4);
                console.log('gps connection' + gpsID);
                let vehicle = vehicles[gpsID];
                const update = [
                    gpsID,
                    messageArray['lat'],
                    messageArray['long']
                ];
                if (vehicle) {
                    console.log('sending to vehicle');
                    vehicle.send(JSON.stringify(update));
                }
                for (let i = 0; i < Object.keys(admins).length; i++) {
                    console.log('sending to admin');
                    admins[i].send(JSON.stringify(update));
                }
            }
        });
        ws.on('close', function () {
            delete ws[id];
            console.log('deleted: ' + id);
        });
    });
};

module.exports = webSocketServices;
