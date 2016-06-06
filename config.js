var sqlite = require('sqlite3');

var db = new sqlite.Database('waterworld.db', sqlite.OPEN_READWRITE);

function getConfig(callback) {
  var cfg = [];
  db.all('SELECT * FROM CONFIG', function(err, rows) {
    rows.forEach(function(row) {
      cfg.push({name : row.NAME, value: row.VALUE});
    });
    callback(cfg);
  });   
}

function getConfigByName(name, callback) {
    db.get('SELECT * FROM CONFIG WHERE NAME=?', name, function(err, row) {
        callback(row);    
    });
}

function saveConfig(name, value) {
    db.run('UPDATE CONFIG SET VALUE=? WHERE NAME=?', 
        value, 
        name, 
        function(err) {
        });   
}