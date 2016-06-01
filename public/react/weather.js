var WeatherDay = React.createClass({
  render: function() {
    return (
      <tr>
        <td>{this.props.data.validTime}</td>
        <td>{this.props.data.t}</td>
        <td>{this.props.data.pit}</td>
      </tr>
    );
  }
});

var WeatherTable = React.createClass({
  loadWeather: function() {
    $.ajax({
      url: 'http://opendata-download-metfcst.smhi.se/api/category/pmp1.5g/version/1/geopoint/lat/59.318412/lon/17.670079/data.json',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data.timeseries});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('Error while loading weather from smhi');
      }.bind(this)
    })
  },

  getInitialState: function() {
    return {data: []};
  },

  componentDidMount: function() {
    this.loadWeather();
  },

  render: function() {
    var weatherDays = this.props.data.map(function(weather){
      return (
        <WeatherDay data={weather} />
      );
    });
    return (
      <table>
        <thead>
          <tr>
            <th>Date/time</th>
            <th>Temperature (C)</th>
            <th>Precipitation (mm/h)</th>
          </tr>
        </thead>
        <tbody>
          {weatherDays}
        </tbody>
      </table>
    );
  }
});
