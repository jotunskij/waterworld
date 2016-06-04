var rpio = require('rpio');

const M_PIN = 11;
var hertz = 0;
var buf = Buffer.alloc(1000000);
rpio.open(M_PIN, rpio.INPUT);

process.on('message', function(m) {
  var totalEdges = 0;
  var now = new Date();
  var startTime = now.getTime();
  for (var u = 0; u < 5; u++) {
    rpio.readbuf(M_PIN, buf);
    var tmp = new Array(buf.length);
    for (i = 0; i < buf.length; i++) {
      tmp[i] = buf[i];
    }
    var str = tmp.join('').replace(/0+/g, '0').replace(/1+/g, '1');
    totalEdges += (str.match(/1/g) || []).length;
  }
  now = new Date();
  var endTime = now.getTime();
  var execMs = endTime - startTime;
  console.log("Total edges: " + totalEdges + ", ms: " + execMs);

  process.send(totalEdges / (execMs / 1000));
});