var sqlite = require('sqlite3');

var db = new sqlite.Database('/home/pi/Repos/waterworld/waterworld.db', sqlite.OPEN_READWRITE);

module.exports = {

  addWatering: function(callback) {
    var startDate = new Date();
    var utcDate = startDate.toUTCString();
    console.log("Watering started: " + utcDate);
    db.run('INSERT INTO WATERING (STARTED) VALUES (?)',
      utcDate,
      function(err) {
        if (err) {
          console.log('Error while inserting water entry: ' + err);
        }
        callback(utcDate);
      }
    );
  },

  endWatering: function(startTime) {
    var endDate = new Date();
    var utcDate = endDate.toUTCString();
    console.log("Watering ended: " + utcDate);
    db.run('UPDATE WATERING SET ENDED=? WHERE STARTED=?',
      utcDate,
      startTime,
      function(err) {
        if (err) {
          console.log('Error while updating watering entry: ' + err)
        }
      }
    );
  },

  getWatering: function(callback) {
    var waterings = [];
    db.all('SELECT * FROM WATERING', function(err, rows) {
      rows.forEach(function(row) {
        waterings.push({
          id: row.ID,
          started : row.STARTED,
          ended: row.ENDED
        });
      });
      callback(waterings);
    });
  }

}

