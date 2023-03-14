const url = require('url');
const axios = require('axios');
const {
    updatePosition,
    addEvent_Bin_state
} = require('./controllers/ver1/wss');

const webSocketServices = (wss) => {
    let vehicles = {};
    let gpss = {};
    let admins = {};
    let routing = {};
    wss.on('connection', function connection(ws, req) {
        console.log('A new client connected');
        try {
            const parameters = url.parse(req.url, true);
            let id = parameters.query.id;
            console.log("check id: ", id);
            if (id[0] == 'v') {
                id = id.substr(id.length - 1);
                vehicles[id] = ws;
            }
            if (id[0] == 'g') {
                id = id.substr(id.length - 1);
                gpss[id] = ws;
            }
            if (id[0] == 'a') {
                id = id.substr(id.length - 1);
                admins[id] = ws;
            }
            if (id[0] == 'r') {
                id = id.substr(id.length - 1);
                routing[id] = ws;
            }
        } catch (err) {
            console.log(err);
        }
        try {
            setInterval( async () => {
                // let vehicles = await axios.get("/path/to/api/get-all-vehicle-info");
                let vehicles = [];
                for (let vehicle of vehicles) {
                    let code = vehicle.code
                    console.log('check vehicle code: ' + code);
                    const update = [
                        code,
                        vehicle['latitude'],
                        vehicle['longitude']
                    ];
                    for (const [key, value] of Object.entries(admins)) {
                        console.log('check sending vehicle info to admin site: ', update);
                        value.send(JSON.stringify(update));
                    }
                    updatePosition({
                        latitude: vehicle['latitude'],
                        longitude: vehicle['longitude'],
                        code: code
                    })
                }
            }, 2000)
        } catch (err) {
            console.log(err);
        }
        // event bin status
        try {
            setInterval( async () => {
                // let bins = await axios.get("/path/to/api/get-all-bin-info");
                let bins = [];
                for (let bin of bins) {
                    let code = bin.code
                    console.log('check bin code: ' + code);
                    let update = [];
                    if (bin.weight >= bin.maxWeight - 15) {
                        update = ['alert', {
                            code: code,
                            latitude: bin.latitude,
                            longitude: bin.longitude,
                            weight: bin.weight,
                            updatedAt: bin.updatedAt,
                            status: 'full'
                        }, 'bin full', 'bin'];
                        addEvent_Bin_state({
                            code: code,
                            weight: bin['weight'],
                            status: update.status,
                        })
                    } else if (bin.weight <= 5) {
                        update = ['no-alert', {
                            code: code,
                            latitude: bin.latitude,
                            longitude: bin.longitude,
                            weight: bin.weight,
                            updatedAt: bin.updatedAt,
                            status: 'empty',
                        }, 'bin empty', 'bin'];
                        addEvent_Bin_state({
                            code: code,
                            weight: bin['weight'],
                            status: update.status,
                        })
                    } else {
                        update = ['no-alert', {
                            code: code,
                            latitude: bin.latitude,
                            longitude: bin.longitude,
                            weight: bin.weight,
                            updatedAt: bin.updatedAt,
                            status: 'half',
                        }, 'bin half', 'bin'];
                    }
                    for (const [key, value] of Object.entries(admins)) {
                        console.log('check sending bin info to admin: ', update);
                        value.send(JSON.stringify(update));
                    }
                }
            }, 2000)
        } catch (err) {
            console.log(err);
        }
        ws.on('close', function () {
            ws.close();
        });
    });
};

module.exports = webSocketServices;