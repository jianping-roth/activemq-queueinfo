var express = require('express');
var jmx = require("jmx");
var router = express.Router();
var Q = require("q");

var host = "localhost";
var port = "9500";
var error = false;

router.get('/', function(req, res) {
  res.render('index', {
    "port" : port,
    "host" : host
  });
});

function retrieveBeanInfo(host, callback) {
  client = jmx.createClient({
    service: "service:jmx:rmi:///jndi/rmi://".concat(host).concat(":").concat(port).concat("/jmxrmi")
  });

  client.connect();

  client.on("connect", function () {
    console.log("connected");
    listBeans(client).then(function (beans) {
      console.log("got bean: " + beans);
      var allBeans = extractQueues(beans)
      var count = 0;
      for (var i in allBeans) {
        getBeanProperties(client, allBeans[i], i).then(function (queueInfo) {
          count = count + 1;
          if (count === allBeans.length) {
            callback(allBeans);
          }
        });
      }
    });
  });

  client.on("error", function (err) {
    console.log(err);
    callback([]);
  })
}

module.exports = router;
