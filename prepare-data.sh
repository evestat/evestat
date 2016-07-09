#!/bin/sh

# Clean before
rm ./data/dump.zip
rm ./data/eve.js
rm ./data/wormhole.js
rm -Rf ./data/sde
# Download dump
curl -0 https://cdn1.eveonline.com/data/sde/tranquility/sde-20160704-TRANQUILITY.zip -o ./data/dump.zip
# Unpack zip archive
unzip ./data/dump.zip -d data
# Will do generate solarsystems (data/sde/fsd/unierse/eve)
npm run process eve
# Will do generate wormholes (data/sde/fsd/unierse/wormholes)
npm run process wormhole
# Clean after
rm -Rf ./data/sde
rm -Rf ./data/dump.zip