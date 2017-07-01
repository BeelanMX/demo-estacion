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
    dataSize: 2
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
    typeId:'73',
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
    typeId:'86',
    type:'gpsLocation',
    dataSize: 9
  },

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
      console.log(type)
      var newI = j + type.dataSize;
      console.log(j,newI)
      var dataPayload = ''
      for(var k = j + 1; k <= newI; k++ ){
        dataPayload+= ob[k]
      }
      payloadObjecks.push({ref: ob[j-1] ,type: type.typeId,data: dataPayload});
      j = j + type.dataSize;
  }
  return payloadObjecks
}
function getValue() {
  let orderObjet = payloadIterator('01027B0C');
  console.log(orderObjet);
}

getValue();
