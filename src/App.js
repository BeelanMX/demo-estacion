import React, { Component } from 'react';
import logo from './logo.svg';
import CircleChart from './components/CircleChart';
import DirectionChar from './components/DirectionChar';
import dataFormat from './util'
import TempGraf from './components/TempGraf'
import PresionChart from './components/PresionChart'
import SpeedChart from './components/SpeedChart'

import './App.css';

const deviceId = "1291923847474782";
const url = `http://api.beelan.mx/v1/uplink/${deviceId}`;
const options = {
  method: "GET",
  headers: {
    authorization: "GIPLte7bPxW3UkTwacVfM7kNvwE=",
  }
}
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data1: 30,
      data2: 45.5,
      data: [],
      refsNames: {
        '01': 'winddir',
        '02': 'windspeedmph',
        '03': 'humidity',
        '04': 'tempf',
        '05': 'rainin',
        '06': 'dailyrainin',
        '07': 'pressure',
        '08': 'batt_lvl',
        '09': 'light_lvl',
      }
    }
  }
  componentWillMount() {
    console.warn(options);
    fetch(url, options)
      .then((res) => res.json())
      .then((arrayData) =>  dataFormat.base64toHEX(arrayData[0].data))
      .then(hexaData => dataFormat.getValue(hexaData))
      .then(result => this.setState({
        data: result
      }))
    this.timer = setInterval(() => {
      fetch(url, options)
        .then((res) => res.json())
        .then((arrayData) =>  dataFormat.base64toHEX(arrayData[0].data))
        .then(hexaData => dataFormat.getValue(hexaData))
        .then(result => this.setState({
          data: result
        }))
    }, 30000);
    // dataFormat.getValue()
  }
  componentWillUnmount() {
  clearInterval(this.timer);
}
  render() {
    const {data, refsNames} = this.state
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Beelan Demo Estación Meteorológica</h2>
        </div>
        <div className="chartsSections">
          {
            data.map((item, i) => {
              switch (item.ref) {
                case '01':
                  return <DirectionChar key={i} refs={item.ref} title={refsNames[item.ref]} data={item.data}/>
                  break;
                case '02':
                  return <SpeedChart key={i} refs={item.ref} title={refsNames[item.ref]} data={item.data}/>
                  break;
                  case '04':
                      return <TempGraf key={i} data={item.data}/>
                    break;
                  case '07':
                      return <PresionChart key={i} title={refsNames[item.ref]}  data={item.data}/>
                    break;
                default:
                return <CircleChart key={i} refs={item.ref} title={refsNames[item.ref]} data={item.data}/>
              }
            })
          }
        </div>
      </div>
    );
  }
}

export default App;
