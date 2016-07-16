var i2c = require('i2c');
var address = 0x20;
var wire = new i2c(address, {device: '/dev/i2c-1'});
var winston = require('winston');

module.exports = {
  scan: function() {
    wire.scan(function(err, data) {
      // result contains an array of addresses
      winston.info('Wire error: ' + err);
      winston.info('Wire scan: ' + data);
    });
  },

  getMoisture: function(callback) {
    try {
      wire.readBytes('0', 2, function (err, res) {
        if (err) {
          winston.error('Error while reading moisture: ' + err);
          callback(-1);
          return;
        }
        var i = res[0] << 8;
        i = i | res[1];
        callback(i);
      });
    } catch(err) {
      winston.error('Caught exception in getMoisture: ' + err);
      callback(-1);
    }
  },

  getTemperature: function(callback) {
    wire.readBytes('5', 2, function(err, res) {
      if (err) {
        winston.error('Error while reading temperature: ' + err);
        callback(-1);
        return;
      }
      var i = res[0] << 8;
      i = i | res[1];
      callback(i/10.0);
    });
  }

}


