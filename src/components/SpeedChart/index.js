import React , {Component} from 'react';
import Chart from 'd3-circle';
import PropTypes from 'prop-types';

class SpeedChart extends Component {
  componentDidMount() {
    this.a = new Chart({
      target: this.refs[this.props.refs],
      format: d => `${ d * 100 } mph`
    })
    this.a.render({ value: this.props.data / 100 })
  }
  componentWillReceiveProps(nextProps) {
    this.a.update({ value: nextProps.data / 100 })
  }
  render() {
    return (
      <section className="chartPanel">
        <h3>{this.props.title}</h3>
        <p>{this.props.description}</p>
        <svg ref={this.props.refs} className="chart"></svg>
      </section>
    );
  }
}

SpeedChart.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  refs: PropTypes.string.isRequired
}
SpeedChart.defaultProps = {
  title:'Default Title',
  refs: `refs${Math.random()}`
};

export default SpeedChart;
