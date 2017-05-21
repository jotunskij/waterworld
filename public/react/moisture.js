var Moisture = React.createClass({
  loadMoisture: function() {
    $.ajax({
      url: '/moisture',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({value: data.value});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('Error while loading moisture');
      }.bind(this)
    })
  },

  getInitialState: function() {
    return {value: 0};
  },

  componentDidMount: function() {
    //this.loadMoisture();
    //setInterval(this.loadMoisture, 5000);
  },

  render: function() {
    return (
      <div>
        <div className="row">
          <div className="small-4 columns">
            <h5>Current moisture value:</h5>
          </div>
          <div className="small-8 columns">
            <h5>{this.state.value}</h5>
          </div>
        </div>
      </div>
    );
  }
});

ReactDOM.render(
  <Moisture />,
  document.getElementById('moisture')
);




