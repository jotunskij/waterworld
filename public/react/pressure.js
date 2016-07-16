var Pressure = React.createClass({
  loadPressure: function() {
    $.ajax({
      url: '/pressure',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({value: data.value, time: new Date().toUTCString()});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('Error while loading pressure');
      }.bind(this)
    })
  },

  getInitialState: function() {
    return {value: -1, time: new Date().toUTCString()};
  },

  componentDidMount: function() {
    this.loadPressure();
    setInterval(this.loadPressure, 5000);
  },

  render: function() {
    return (
      <div>
        <div className="row">
          <div className="small-4 columns">
            <h5>Current pressure value:</h5>
          </div>
          <div className="small-1 columns">
            <h5>{this.state.value}</h5>
          </div>
          <div className="small-7 columns">
            <h5>{this.state.time}</h5>
          </div>
        </div>
      </div>
    );
  }
});

ReactDOM.render(
  <Pressure />,
  document.getElementById('pressure')
);




