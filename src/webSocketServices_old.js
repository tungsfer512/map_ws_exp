// const { default: axios } = require('axios');
const url = require('url');
// const { Vehicle, VehicleStateLog } = require('./models/ver1/models');
// const { Bin, BinStateLog } = require('./models/ver1/models');
const {
    addEvent_Vehicle_trouble,
    updatePosition,
    addEvent_Bin_state,
    addEvent_Vehicle_work,
    addEvent_Vehicle_state,
    check_Vehicle_area_bin
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
        ws.on('message', async function (message) {
            console.log('check message: ', message);
            var messageArray = JSON.parse(message);
            // gps send location
            try {
                let gps = messageArray['id'].substr(0, 3);

                if (gps == 'gps') {
                    let gpsID = messageArray['id'].substr(4);
                    console.log('check gps connection: ' + gpsID);
                    let vehicle = vehicles[gpsID];
                    const update = [
                        gpsID,
                        messageArray['lat'],
                        messageArray['long']
                    ];
                    updatePosition({
                        latitude: messageArray['lat'],
                        longitude: messageArray['long'],
                        vechicleID: gpsID
                    }).then(() => {
                        if (vehicle) {
                            console.log('check sending vehicle gps to client: ' + update);
                            vehicle.send(JSON.stringify(update));
                        }
                        for (const [key, value] of Object.entries(admins)) {
                            console.log('check sending vehicle gps to admin: ', update);
                            // check sending vehicle gps to admin:  [ '2', 21.02617, 105.8509 ] ([id_vehicle: string, lat: double, long: double])
                            value.send(JSON.stringify(update));
                        }
                    })
                    
                }
            } catch (err) {
                console.log(err);
            }
            // event vehicle breakdown
            try {
                let vehicle_break = messageArray['id'].substr(
                    0,
                    messageArray['id'].length - 2
                );
                // console.log(vehicle_break);

                if (vehicle_break == 'vehicle_break') {
                    let vehicleID = messageArray['id'].substr(
                        messageArray['id'].length - 1
                    );
                    console.log('check vehicle breakdown connection: ' + vehicleID);

                    addEvent_Vehicle_trouble({
                        altitude: messageArray['altitude'],
                        speed: messageArray['speed'],
                        angle: messageArray['angle'],
                        fuel: messageArray['fuel'],
                        trouble: messageArray['trouble'],
                        description: messageArray['description'],
                        status: 'breakdown',
                        vehicleID: vehicleID
                    }).then((res) => {
                        // console.log(res);
                        let ob_= {
                            latitude: res.lat,
                            longitude: res.long,
                            updatedAt: res.updateAt,
                            id: vehicleID
                        }
                        // console.log(ob_);
                        const update = ['alert', ob_,'car breakdown'];
                        for (const [key, value] of Object.entries(admins)) {
                            console.log('sending to admin');
                            value.send(JSON.stringify(update));
                        }
                    });
                }
            } catch (err) {
                console.log(err);
            }
            // event bin status
            try {
                let bin = messageArray['id'].substr(0, 3);
                if (bin == 'bin') {
                    let binID = messageArray['id'].substr(4);
                    console.log('check bin connection: ' + binID);
                    addEvent_Bin_state({
                        weight: messageArray['weight'],
                        status: messageArray['status'],
                        binID:binID,
                        description: messageArray['description']
                    }).then((res) => {
                        const update = ['alert', {
                            latitude:res.latitude,
                            longitude:res.longitude,
                            weight:messageArray['weight'],
                            updatedAt:res.updatedAt,
                            id:binID,
                            status:messageArray['status']
                        }, messageArray['description'],'bin'];
                        for (const [key, value] of Object.entries(admins)) {
                            console.log('check sending bin info to admin: ', update);
                            value.send(JSON.stringify(update));
                            // check sending bin info to admin:  [
                            //     'alert',
                            //     {
                            //       latitude: 21.025727,
                            //       longitude: 105.855275,
                            //       weight: 30,
                            //       updatedAt: 2023-03-14T06:51:55.509Z,
                            //       id: '48',
                            //       status: 'full'
                            //     },
                            //     'bin full',
                            //     'bin'
                            //   ]
                        }
                        check_Vehicle_area_bin({binID:binID}).then((res) =>{
                            // console.log(res.vehicleID)
                            let vehicle = vehicles[res.vehicleID]
                            if(vehicle){
                                console.log('check sending bin info to vehicle: ' + res.vehicleID, update);
                                vehicle.send(JSON.stringify(update));
                            }
                        })
                    })
                    
                }
            } catch (err) {
                console.log(err);
            }
            // request get routing machine
            try {
                let request = messageArray['id'].substr(
                    0,
                    messageArray['id'].length - 2
                );
                if (request == 'request') {
                    console.log('request ');
                    const update = [
                        messageArray['id'],
                        messageArray['bin'],
                        messageArray['vehicle']
                    ];

                    for (const [key, value] of Object.entries(routing)) {
                        console.log('sending to routing_machine');
                        value.send(JSON.stringify(update));
                    }
                }
            } catch (err) {
                console.log(err);
            }
            // status vehicle
            try {
                let vehicle_status = messageArray['id'].substr(
                    0,
                    messageArray['id'].length - 2
                );
                if(vehicle_status == 'vehicle_status'){
                    let vehicleID = messageArray['id'].substr(messageArray['id'].length - 1)
                    console.log('vehicle status connection' + vehicleID)

                    addEvent_Vehicle_state({
                        altitude:messageArray['altitude'],
                        speed:messageArray['speed'],
                        angle:messageArray['angle'],
                        state:messageArray['state'],
                        description:messageArray['description'],
                        status:messageArray['status'],
                        vehicleID:vehicleID
                    }).then((res)=>{
                        const update = ['alert', {
                            latitude:res.latitude,
                            longitude:res.longitude,
                            status:messageArray['status'],
                            updatedAt:res.updatedAt,
                            id:vehicleID
                        }, 'Vehicle replace status','vehicle'];
                        for (const [key, value] of Object.entries(admins)) {
                            console.log('sending to admin');
                            value.send(JSON.stringify(update));
                        }
                        let vehicle = vehicles[vehicleID]
                        if (vehicle) {
                            console.log('sending to vehicle');
                            vehicle.send(JSON.stringify(update));
                        }
                    })
                }
            } catch(err){
                console.log(err);
            }
        });
        ws.on('close', function () {
            ws.close();
            // console.log('deleted: ' + id);
        });
    });
};

module.exports = webSocketServices;
