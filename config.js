var sqlite = require('sqlite3');

var db = new sqlite.Database('/home/pi/Repos/waterworld/waterworld.db', sqlite.OPEN_READWRITE);

module.exports = {

  getConfig: function(callback) {
    var cfg = [];
    db.all('SELECT * FROM CONFIG', function(err, rows) {
      rows.forEach(function(row) {
        cfg.push({name : row.NAME, value: row.VALUE});
      });
      callback(cfg);
    });
  },

  getConfigByName: function(name, callback) {
    db.get('SELECT * FROM CONFIG WHERE NAME=?', name, function(err, row) {
      callback(row);
    });
  },

  saveConfig: function(name, value) {
    db.run('UPDATE CONFIG SET VALUE=? WHERE NAME=?',
      value,
      name,
      function(err) {
      });
  }

}
