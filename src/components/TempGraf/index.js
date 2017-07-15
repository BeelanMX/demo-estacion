import React from 'react';
import BarChart from 'react-bar-chart';

const margin = {top: 20, right: 20, bottom: 30, left: 40};

const TempGraf = React.createClass({
  getInitialState() {
    return { width: 400, data:[{text: 'Temperatura', value: 0 }] };
  },
  getDefaultProps() {
    return {
      data: 100
    };
  },

  handleBarClick(element, id){
    console.log(`The bin ${element.text} with id ${id} was clicked`);
  },

  render() {
    const {data} = this.props
    const C = (data - 32)/1.8
    return (
        <div ref='root'>
            <div style={{width: '50%'}}>
                <BarChart ylabel='Temperatura'
                  width={this.state.width}
                  height={300}
                  margin={margin}
                  data={[{text: `${data} °F`, value: data }, {text: `${C.toFixed(2)} °C`, value: C }]}
                  onBarClick={this.handleBarClick}/>
            </div>
        </div>
    );
  }
});

export default TempGraf
