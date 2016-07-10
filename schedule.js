var sqlite = require('sqlite3');

var db = new sqlite.Database('/home/pi/Repos/waterworld/waterworld.db', sqlite.OPEN_READWRITE);

module.exports = {

  getSchedules: function(callback) {
    var schedules = [];
    db.all('SELECT * FROM SCHEDULE', function(err, rows) {
      rows.forEach(function(row) {
        schedules.push({
          id: row.ID,
          monday : row.MONDAY,
          tuesday: row.TUESDAY,
          wednesday: row.WEDNESDAY,
          thursday: row.THURSDAY,
          friday: row.FRIDAY,
          saturday: row.SATURDAY,
          sunday: row.SUNDAY,
          time: row.TIME,
          active: row.ACTIVE,
          duration: row.DURATION
        });
      });
      callback(schedules);
    });
  },

  saveSchedule: function(body) {
    console.log("Saving schedule: " + JSON.stringify(body));
    db.run('UPDATE SCHEDULE SET MONDAY=?, TUESDAY=?, WEDNESDAY=?, THURSDAY=?, FRIDAY=?, SATURDAY=?, SUNDAY=?, TIME=?, ACTIVE=?, DURATION=? WHERE ID=?',
      body.monday,
      body.tuesday,
      body.wednesday,
      body.thursday,
      body.friday,
      body.saturday,
      body.sunday,
      body.time,
      body.active,
      body.duration,
      body.id,
      function(err) {
        if (err) {
          console.log("Error while saving schedule: " + err);
        }
      });
  }

}
