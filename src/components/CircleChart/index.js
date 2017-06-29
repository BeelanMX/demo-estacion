import React , {Component} from 'react';
import Chart from 'd3-circle';
import PropTypes from 'prop-types';
import './CircleChart.css'
class CircleChart extends Component {
  componentDidMount() {
    this.a = new Chart({
      target: this.refs[this.props.refs],
      format: d => `${ d * 100 }%`
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

CircleChart.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  refs: PropTypes.string.isRequired
}
CircleChart.defaultProps = {
  title:'Default Title',
  refs: `refs${Math.random()}`
};

export default CircleChart;
