var Watering = React.createClass({
  getInitialState: function() {
    return {
      id: this.props.data.id,
      started: this.props.data.started,
      ended: this.props.data.ended
    };
  },

  render: function() {
    return (
      <div>
        <div className="row">
          <div className="small-4 columns">
            <span>{this.state.started}</span>
          </div>
          <div className="small-8 columns">
            <span>{this.state.ended}</span>
          </div>
        </div>
      </div>
    );
  }

});

var WateringTable = React.createClass({
  loadWatering: function() {
    $.ajax({
      url: '/watering',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('Error while loading watering');
      }.bind(this)
    })
  },

  getInitialState: function() {
    return {data: []};
  },

  componentDidMount: function() {
    this.loadWatering();
  },

  render: function() {
    var waterings = this.state.data.map(function(watering){
      return (
        <Watering data={watering} key={watering.id}/>
      );
    });
    return (
      <div>
        <div className="row">
          <div className="small-4 columns">
            <h5><b>Started</b></h5>
          </div>
          <div className="small-8 columns">
            <h5><b>Ended</b></h5>
          </div>
        </div>
        {waterings}
      </div>
    );
  }
});

ReactDOM.render(
  <WateringTable />,
  document.getElementById('watering')
);