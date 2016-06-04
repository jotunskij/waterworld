var ConfigValue = React.createClass({
  getInitialState: function() {
      return {name: this.props.data.name, value: this.props.data.value, saved: false};
  },  
    
  render: function() {
    let c = "button";
    let text = "Save";
    if (this.state.saved) {
        c = "success button";
        text = "Saved!";        
    }
    return (
        <div className="row">
            <div className="small-4 columns">
                {this.state.name}
            </div>
            <div className="small-4 columns">
                <input 
                    type="text" 
                    value={this.state.value} 
                    onChange={this.handleValueChange}
                    />
            </div>
            <div className="small-4 columns">
                <input 
                    className={c}
                    type="button" 
                    onClick={this.handleSubmit} 
                    value={text} />
            </div>
        </div>
    );
  },
  
  handleValueChange: function(e) {
    this.setState({value: e.target.value, saved: false});  
  },
  
  handleSubmit: function(e) {
    e.preventDefault();
    console.log('Data: ' + JSON.stringify(this.state));
    $.ajax({
      url: '/config',
      type: 'POST',
      dataType: 'json',
      data: this.state,
      success: function(data) {
          this.setState({saved: true});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('Error while saving configuration');
      }.bind(this)
    })    
  }
  
});

var ConfigTable = React.createClass({
  loadConfig: function() {
    $.ajax({
      url: '/config',
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
    this.loadConfig();
  },

  render: function() {
    var configValues = this.state.data.map(function(configRow){
      return (
        <ConfigValue data={configRow} key={configRow.name}/>
      );
    });
    return (
       <div>{configValues}</div>
    );
  }
});

ReactDOM.render(
  <ConfigTable />,
  document.getElementById('config')
);
