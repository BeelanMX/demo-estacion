import React, { Component } from 'react';
import logo from './logo.svg';
import CircleChart from './components/CircleChart'
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data1: 30,
      data2: 45.5,
      data: '0102XXXX'
    }
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to Beelan Demo</h2>
        </div>
        <div className="chartsSections">
        <CircleChart refs='one' title='ONE' data={this.state.data1}/>
        <CircleChart refs='two' title='TwO' data={this.state.data2}/>
        </div>
      </div>
    );
  }
}

export default App;
