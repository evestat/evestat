'use strict';

const glob = require('glob');
const YAML = require('yamljs');
const fs = require('fs');

/*
    center:
    - -2.3556644404880812e+16
    - 1.5954181047741544e+16
    - -1.3573020734138632e+17

    security: -0.01431927738433703
    solarSystemID: 30001047
    // solarSystemNameID: 270011
    stargates:
        50003703:
            destination: 50002839
            position:
            - 211013591040.0
            - 10564853760.0
            - 222924103680.0
            typeID: 29633

        50003704:
            destination: 50003220
            position:
            - 211003269120.0
            - 10597294080.0
            - 222930984960.0
            typeID: 29633
        
        50013968:
            destination: 50013967
            position:
            - -2210588467200.0
            - 1364110172160.0
            - 1741606871040.0
            typeID: 29634
 */

let filename = process.argv[2];

glob(`${__dirname}/data/sde/fsd/universe/${filename}/**/solarsystem.staticdata`, processFiles);

function processFiles(e, fileNames) {

    let count = fileNames.length;
    let gateToSystemMap = {}; // gate -> system
    let systems = {};

    for(let fileName of fileNames) {
        console.log(count --);
        let nativeObject = YAML.load(fileName);

        let parts = fileName.split('/');
        parts.pop();
        let name = parts.pop();
        let resultingObject = {
            solarSystemName: name,
            center: {
                x: nativeObject.center[0],
                y: nativeObject.center[1],
                z: nativeObject.center[2]
            },
            security: nativeObject.security,
            solarSystemID: nativeObject.solarSystemID,
            stargates: []
        };
        let stargates = nativeObject.stargates,
            nativeStargate = null,
            stargateKeys = Object.keys(stargates);

        for(let key of stargateKeys) {
            gateToSystemMap[key] = name;
            resultingObject.stargates.push(nativeObject.stargates[key].destination);
        }
        systems[name] = resultingObject;
    }
    // transform gates data
    let keys = Object.keys(systems);
    for(let key of keys) {
        let system = systems[key];
        let list = [];
        for(let gateId of system.stargates) {
            if(gateToSystemMap[gateId]) {
                list.push(gateToSystemMap[gateId]);
            } else {
                console.log(`Undefined ${gateId} in ${system.solarSystemName}`);
            }
        }
        systems[key].stargates = list;
    }
    fs.writeFile(`./data/${filename}.js`, `var json${filename} = ${JSON.stringify(systems, null, '\t')}`, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log(`The ${filename} was saved!`);
    }); 
}
