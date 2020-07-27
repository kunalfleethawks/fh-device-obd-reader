/*
 * Copyright 2010-2018 FleetHawks.com, Inc. or its affiliates. All Rights Reserved.
 */
const ggSdk = require("aws-greengrass-core-sdk");

var mqtt = require('mqtt')
localMqttClient = mqtt.connect('mqtt://localhost')

const iotClient = new ggSdk.IotData();
const OBDReader = require("serial-obd");
const OBD_PORT = process.env.SERIAL_PORT || "/dev/ttyUSB0";
const serialOBDReader = new OBDReader(OBD_PORT);
const dataReceivedMarker = {};
const obdData = undefined;
const obdPolling = process.env.POLLING_RATE || 15000;
const staticTopicName = "quantum/telemetry/obd";
const realTimeTopicName = getRealTimeTopicName();

localMqttClient.on('connect', () => {
  localMqttClient.subscribe('#', function (err) {
    if (!err) {
      console.log('local mqtt connection successfull');
    }
  })
})

serialOBDReader.on("dataReceived", function (data) {
  // console.log(data);
  dataReceivedMarker = data;

  obdData = {
    data: dataReceivedMarker,
    device: {
      carrierId: "bbcc9630-aad3-11ea-a21c-47fcabe5ba03", //will be pulled dynamically
      quantumId: "230fb8a0-ac77-11ea-80db-3bbb8dbb1167", //will be pulled dynamically
      deviceSerial: "230fb8a0-ac77-11ea-80db-3bbb8dbb1167", //will be pulled dynamically
      userId: "param",
      recordTime: new Date(),
      recordType: "OBD",
    },
  };

  if (obdData) {
    const pubOpt = {
      topic: staticTopicName,
      payload: JSON.stringify(obdData),
      queueFullPolicy: "AllOrError",
    };
    localMqttClient.publish('hw/obd/status', JSON.stringify(obdData));
    iotClient.publish(pubOpt, publishCallback);
  }
});

serialOBDReader.on("connected", function (data) {
  this.addPoller("vss");
  this.addPoller("rpm");
  this.addPoller("temp");
  this.addPoller("load_pct");
  this.addPoller("map");
  this.addPoller("fli");
  this.startPolling(obdPolling);
});

serialOBDReader.connect();

function publishCallback(err, data) {
  console.log(err);
  console.log(data);
}

function getRealTimeTopicName() {
  //Get This dynamically
  const carrierId = "bbcc9630-aad3-11ea-a21c-47fcabe5ba03";
  const quantumId = "230fb8a0-ac77-11ea-80db-3bbb8dbb1167";

  return `quantum/realtime/${carrierId}/${quantumId}/obd`;
}

// This is a handler which does nothing for this example
exports.execute = function handler(event, context) {
  console.log(event);
  console.log(context);
};
