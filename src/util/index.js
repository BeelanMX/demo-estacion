var atob = require('atob');

var noms = {
  '00': {
    typeId: '00',
    type: 'digitalInput',
    dataSize: 1
  },
  '01': {
    typeId: '01',
    type: 'digitalOutput',
    dataSize: 1
  },
  '02': {
    typeId: '02',
    type: 'analogInput',
    dataSize: 2
  },
  '03': {
    typeId: '03',
    type: 'analogOutput',
    dataSize: 2
  },
  '65': {
    typeId: '65',
    type: 'illuminanceSensor',
    dataSize: 2
  },
  '66': {
    typeId: '66',
    type: 'presenceSensor',
    dataSize: 1
  },
  '67': {
    typeId: '67',
    type: 'temperatureSensor',
    dataSize: 2
  },
  '68': {
    typeId: '68',
    type: 'humiditySensor',
    dataSize: 1
  },
  '71': {
    typeId:'71',
    type:'accelerometer',
    dataSize: 6
  },
  '73': {
    typeId:'73',
    type:'barometer',
    dataSize: 2
  },
  '86': {
    typeId:'86',
    type:'gyrometer',
    dataSize: 6
  },
  '88': {
    typeId:'88',
    type:'gpsLocation',
    dataSize: 9
  },

}
const base64toHEX = (base64) => {
  console.log('ENTER base64toHEX');
  const raw = atob(base64);
  let HEX = '';
  for (let i = 0; i < raw.length; i++) {
    const hex = raw.charCodeAt(i).toString(16);
    HEX += (hex.length === 2 ? hex : `0${hex}`);
  }
  return HEX.toUpperCase();
}
function parseHexString(str) {
   var result = [];
   while (str.length >= 2) {
       result.push(parseInt(str.substring(0, 2), 16));
       str = str.substring(2, str.length);
   }
   return result;
}

function pairsOnArray(str) {
  var res = [];

  for (var i = 0, len = str.length; i < len; i++) {
    res.push(str[i] + str[++i])
  }
  return res
}
function payloadIterator (payload){
  var payloadObjecks= []
  var ob = pairsOnArray(payload)
  for (var j = 1; j < ob.length; j++) {
      var type = noms[ob[j]];
      var newI = j + type.dataSize;
      var dataPayload = ''
      for(var k = j + 1; k <= newI; k++ ){
        dataPayload+= ob[k]
      }
      payloadObjecks.push({ref: ob[j-1] ,type: type.typeId, typeName:type.type, data: dataPayload});
      j = j + 1 + type.dataSize;
  }
  return payloadObjecks
}
function oneValue (data) {
  let v1 = parseInt(data[1], 16)
  // addDigitalInput addDigitalOutput addPresence

  // buffer[cursor++] = channel;
  // buffer[cursor++] = LPP_DIGITAL_INPUT;
  // buffer[cursor++] = value;
  return v1;
}
function analogsValue (data) {
    let v1 = parseInt((data[0]), 16) << 8;
    let v2 = parseInt(data[1], 16)
  // addAnalogInput addAnalogOutput
  // int16_t val = value * 100;
  // buffer[cursor++] = channel;
  // buffer[cursor++] = LPP_ANALOG_INPUT;
  // buffer[cursor++] = val >> 8;
  // buffer[cursor++] = val;
  return ((v1 + v2) / 100);
}
function Luminosity (data) {
  let v1 = parseInt((data[0]), 16) << 8;
  let v2 = parseInt(data[1], 16)
  // addLuminosity
  // buffer[cursor++] = channel;
  //   buffer[cursor++] = LPP_LUMINOSITY;
  //   buffer[cursor++] = lux >> 8;
  //   buffer[cursor++] = lux;
  return (v1 + v2)
}
function tempPresureValue (data) {

  let v1 = parseInt((data[0]), 16) << 8;
  let v2 = parseInt(data[1], 16)

  // addTemperature                             // addBarometricPressure
  // int16_t val = celsius * 10;              //   int16_t val = hpa * 10;
  // buffer[cursor++] = channel;             // buffer[cursor++] = channel;
  // buffer[cursor++] = LPP_TEMPERATURE;    // buffer[cursor++] = LPP_BAROMETRIC_PRESSURE;
  // buffer[cursor++] = val >> 8;          // buffer[cursor++] = val >> 8;
  // buffer[cursor++] = val;              // buffer[cursor++] = val;

  // now shoul pass strings to Numbers to make de data

  return ( (v1 + v2) / 10);
}

function RelativeHumidity (data) {
  let v1 = parseInt((data[0]), 16);
  // addRelativeHumidity
  // buffer[cursor++] = channel;
  // buffer[cursor++] = LPP_RELATIVE_HUMIDITY;
  // buffer[cursor++] = rh * 2;
  return (v1 / 2)
}
function Accelerometer() {
  // addAccelerometer
  //   int16_t vx = x * 1000;
  // int16_t vy = y * 1000;
  // int16_t vz = z * 1000;
  //
  // buffer[cursor++] = channel;
  // buffer[cursor++] = LPP_ACCELEROMETER;
  // buffer[cursor++] = vx >> 8;
  // buffer[cursor++] = vx;
  // buffer[cursor++] = vy >> 8;
  // buffer[cursor++] = vy;
  // buffer[cursor++] = vz >> 8;
  // buffer[cursor++] = vz;
}
function Gyrometer() {
  // addAccelerometer
  // int16_t vx = x * 100;
  // int16_t vy = y * 100;
  // int16_t vz = z * 100;
  //
  // buffer[cursor++] = channel;
  // buffer[cursor++] = LPP_GYROMETER;
  // buffer[cursor++] = vx >> 8;
  // buffer[cursor++] = vx;
  // buffer[cursor++] = vy >> 8;
  // buffer[cursor++] = vy;
  // buffer[cursor++] = vz >> 8;
  // buffer[cursor++] = vz;
}
function GPS() {
  // addAccelerometer
  // int32_t lat = latitude * 10000;
  // int32_t lon = longitude * 10000;
  // int32_t alt = meters * 100;
  //
  // buffer[cursor++] = channel;
  // buffer[cursor++] = LPP_GPS;
  //
  // buffer[cursor++] = lat >> 16;
  // buffer[cursor++] = lat >> 8;
  // buffer[cursor++] = lat;
  // buffer[cursor++] = lon >> 16;
  // buffer[cursor++] = lon >> 8;
  // buffer[cursor++] = lon;
  // buffer[cursor++] = alt >> 16;
  // buffer[cursor++] = alt >> 8;
  // buffer[cursor++] = alt;
}
function getValue() {
  let orderObjet = payloadIterator('01027B0C02020000036853046703260502000C0602000C07737BB9080201B409650000');
  for (var i = 0; i < orderObjet.length; i++) {
    switch (orderObjet[i].type) {
      case '00':
              console.log('\x1b[33m%s\x1b[0m DIn',oneValue(pairsOnArray(orderObjet[i].data)))
        break;
      case '01':
              console.log('\x1b[33m%s\x1b[0m DOut', oneValue(pairsOnArray(orderObjet[i].data)))
        break;
      case '66':
              console.log('\x1b[33m%s\x1b[0m presenceSensor',oneValue(pairsOnArray(orderObjet[i].data)))
        break;
      case '02':
              console.log('\x1b[33m%s\x1b[0m analogInput',analogsValue(pairsOnArray(orderObjet[i].data)))
        break;
      case '03':
              console.log('\x1b[33m%s\x1b[0m analogOut',analogsValue(pairsOnArray(orderObjet[i].data)))
        break;
      case '65':
              console.log('\x1b[33m%s\x1b[0m iluminat', Luminosity(pairsOnArray(orderObjet[i].data)))
        break;
      case '67':
              console.log('\x1b[33m%s\x1b[0m TEmp', tempPresureValue(pairsOnArray(orderObjet[i].data)))
        break;
      case '73':
              console.log('\x1b[33m%s\x1b[0m presion',tempPresureValue(pairsOnArray(orderObjet[i].data)))
        break;
      case '68':
              console.log('\x1b[33m%s\x1b[0m humedy',RelativeHumidity(pairsOnArray(orderObjet[i].data)))
        break;
      default:

    }
  }
  console.log(orderObjet);
}
// simulatedata console.log('\x1b[45m%s\x1b[0m', base64toHEX('AQJ7DAICAAADaFMEZwMmBQIADAYCAAwHc3u5CAIBtAllAAA') )
getValue();
module.exports = {
  getValue: getValue
};
