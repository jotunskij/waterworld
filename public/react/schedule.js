var Schedule = React.createClass({
  getInitialState: function() {
    return {
      id: this.props.data.id,
      monday: this.props.data.monday,
      tuesday: this.props.data.tuesday,
      wednesday: this.props.data.wednesday,
      thursday: this.props.data.thursday,
      friday: this.props.data.friday,
      saturday: this.props.data.saturday,
      sunday: this.props.data.sunday,
      time: this.props.data.time,
      active: this.props.data.active,
      duration: this.props.data.duration,
      saved: false
    };
  },

  handleMondayChange: function(event) {
    this.setState({monday: event.target.checked ? 1 : 0});
  },
  handleTuesdayChange: function(event) {
    this.setState({tuesday: event.target.checked ? 1 : 0});
  },
  handleWednesdayChange: function(event) {
    this.setState({wednesday: event.target.checked ? 1 : 0});
  },
  handleThursdayChange: function(event) {
    this.setState({thursday: event.target.checked ? 1 : 0});
  },
  handleFridayChange: function(event) {
    this.setState({friday: event.target.checked ? 1 : 0});
  },
  handleSaturdayChange: function(event) {
    this.setState({saturday: event.target.checked ? 1 : 0});
  },
  handleSundayChange: function(event) {
    this.setState({sunday: event.target.checked ? 1 : 0});
  },
  handleActiveChange: function(event) {
    this.setState({active: event.target.checked ? 1 : 0});
  },
  handleTimeChange: function(event) {
    this.setState({time: event.target.value});
  },
  handleDurationChange: function(event) {
    this.setState({duration: event.target.value});
  },
  render: function() {
    let c = "button";
    let text = "Save";
    if (this.state.saved) {
      c = "success button";
      text = "Saved!";
    }
    return (
      <div>
        <div className="row">
          <fieldset class="large-6 columns">
            <legend>Days</legend>
            <input id="monday"
                    type="checkbox"
                    checked={this.state.monday}
                    onChange={this.handleMondayChange} />
              <label for="monday">Monday</label>
            <input id="tuesday"
                    type="checkbox"
                    checked={this.state.tuesday}
                    onChange={this.handleTuesdayChange} />
              <label for="tuesday">Tuesday</label>
            <input id="wednesday"
                    type="checkbox"
                    checked={this.state.wednesday}
                    onChange={this.handleWednesdayChange} />
              <label for="wednesday">Wednesday</label>
            <input id="thursday"
                   type="checkbox"
                   checked={this.state.thursday}
                   onChange={this.handleThursdayChange} />
            <label for="thursday">Thursday</label>
            <input id="friday"
                   type="checkbox"
                   checked={this.state.friday}
                   onChange={this.handleFridayChange} />
            <label for="friday">Friday</label>
            <input id="saturday"
                   type="checkbox"
                   checked={this.state.saturday}
                   onChange={this.handleSaturdayChange} />
            <label for="saturday">Saturday</label>
            <input id="sunday"
                   type="checkbox"
                   checked={this.state.sunday}
                   onChange={this.handleSundayChange} />
            <label for="sunday">Sunday</label>
          </fieldset>
        </div>
        <div className="row">
          <div className="small-4 columns">
            <label>Time
              <input
                id="time"
                type="text"
                value={this.state.time}
                onChange={this.handleTimeChange}
                />
            </label>
          </div>
          <div className="small-4 columns">
            <label>Duration
              <input
                id="duration"
                type="text"
                value={this.state.duration}
                onChange={this.handleDurationChange}
                />
            </label>
          </div>
          <fieldset class="small-2 columns">
            <legend>Active</legend>
            <input id="active"
                   type="checkbox"
                   checked={this.state.active}
                   onChange={this.handleActiveChange} />
          </fieldset>
          <div className="small-4 columns">
            <input
              id="save"
              className={c}
              type="button"
              onClick={this.handleSubmit}
              value={text} />
          </div>
        </div>
      </div>
    );
  },

  handleSubmit: function(e) {
    e.preventDefault();
    console.log('Data: ' + JSON.stringify(this.state));
    $.ajax({
      url: '/schedule',
      type: 'POST',
      dataType: 'json',
      data: this.state,
      success: function(data) {
        this.setState({saved: true});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('Error while saving schedule');
      }.bind(this)
    })
  }

});

var ScheduleTable = React.createClass({
  loadSchedule: function() {
    $.ajax({
      url: '/schedule',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('Error while loading configuration');
      }.bind(this)
    })
  },

  getInitialState: function() {
    return {data: []};
  },

  componentDidMount: function() {
    this.loadSchedule();
  },

  render: function() {
    var schedules = this.state.data.map(function(schedule){
      return (
        <Schedule data={schedule} key={schedule.id}/>
      );
    });
    return (
      <div>{schedules}</div>
    );
  }
});

ReactDOM.render(
  <ScheduleTable />,
  document.getElementById('schedules')
);