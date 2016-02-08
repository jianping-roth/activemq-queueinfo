var express = require('express');
var jmx = require("jmx");
var router = express.Router();
var Q = require("q");

attributes = ["QueueSize", "InFlightCount", "EnqueueCount", "DequeueCount", "ExpiredCount",
  "MaxEnqueueTime", "MinEnqueueTime", "ConsumerCount"];

var host = "localhost";
var port = "9500";
var error = false;

router.post('/host', function(req, res) {
  console.log("new host:" + req.body.host + " new port:" + req.body.port);
  host = req.body.host;
  port = req.body.port;
  res.redirect("/");
});

router.get('/', function(req, res) {
  retrieveBeanInfo(host, function(queueInfo) {
    error = queueInfo.length == 0;
    res.render('queueInfo', {
      "queueList": queueInfo.sort(function(o1, o2) {
          return o1.name.localeCompare(o2.name);
      }),
      "attributes" : ["name"].concat(attributes),
      "port" : port,
      "host" : host,
      "error" : error
    });
  });
});

var listBeans = function(client) {
  var deferred = Q.defer();
  client.listMBeans(function(beans) {
    deferred.resolve(beans);
  });
  return deferred.promise;
};

var parseBeanAttributes = function(beanName) {
  var props = {};
  var propSect = beanName.split(',');
  for (var p in propSect) {
    var kv = propSect[p].split('=');
    if (kv.length > 1) {
      props[kv[0]] = kv[1]
    }
  }

  return props;
}

var getBeanProperties = function(client, queueInfo) {
  var deferred = Q.defer();
  client.getAttributes(queueInfo.bean, attributes, function(retrieved) {
    for (var i in attributes) {
      queueInfo[attributes[i]] = retrieved[i];
    }
    deferred.resolve(queueInfo);
  });
  return deferred.promise;
}

var extractQueues = function(beans) {
  var allBeans = []
  for (var i in beans) {
    var props = parseBeanAttributes(beans[i]);
    if (props["Type"] === "Queue") {
      var queueInfo = {};
      queueInfo.name = props["Destination"];
      queueInfo.bean = beans[i];
      allBeans.push(queueInfo);
    }
  }

  return allBeans;
}

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
