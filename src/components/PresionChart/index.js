import React , {Component} from 'react';
import Chart from 'd3-circle';
import PropTypes from 'prop-types';

class PresionChart extends Component {
  componentDidMount() {
    this.a = new Chart({
      target: this.refs[this.props.refs],
      thickness: 4,
      format: d => `${ d * 1000} hpa`,
      ease: 'easeElastic',
      duration: 600
    })
    this.a.render({ value: this.props.data / 1000 })
  }
  componentWillReceiveProps(nextProps) {
    this.a.update({ value: nextProps.data / 1000 })
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

PresionChart.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  refs: PropTypes.string.isRequired
}
PresionChart.defaultProps = {
  title:'Default Title',
  refs: `refs${Math.random()}`
};

export default PresionChart;
