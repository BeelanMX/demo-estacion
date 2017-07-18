import React , {Component} from 'react';
import PropTypes from 'prop-types';

class LabelData extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: 0
    }
  }
  componentWillMount() {
    this.setState({
      data: this.props.data
    })
  }
  componentWillReceiveProps(nextProps) {
    // this.a.update({ value: nextProps.data / 100 })
    this.setState({
      data: nextProps.data
    })
  }
  render() {
    return (
      <section className="chartPanel">
        <h3>{this.props.title}</h3>
        <p>{this.props.description}</p>
          {`${this.state.data} ${this.props.text}`}
      </section>
    );
  }
}

LabelData.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  text: PropTypes.string,
  refs: PropTypes.string.isRequired
}
LabelData.defaultProps = {
  title:'Default Title',
  refs: `refs${Math.random()}`
};

export default LabelData;
