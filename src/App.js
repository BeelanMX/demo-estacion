import React, { Component } from 'react';
import logo from './logo.svg';
import CircleChart from './components/CircleChart'
import dataFormat from './util'
import './App.css';

const url = 'http://api.beelan.mx/v1/uplink/1291923847474782';

const options = {
  method: "GET",
  headers: {
    authorization: "4v/LYowF9/Ar5X+B5RfNYafYWh8=",
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
    // dataFormat.getValue()
  }
  render() {
    console.warn('ofkoakfoa', this.state);
    const {data, refsNames} = this.state
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to Beelan Demo</h2>
        </div>
        <div className="chartsSections">
          {
            data.map((item) => {
              return <CircleChart refs={item.ref} title={refsNames[item.ref]} data={item.data}/>
            })
          }
        </div>
      </div>
    );
  }
}

export default App;
