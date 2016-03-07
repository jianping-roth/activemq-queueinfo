var express = require('express');
var jmx = require("jmx");
var router = express.Router();
var Q = require("q");

attributes = ["Name", "Level"];
levels = ["ERROR", "WARN", "INFO", "DEBUG", "TRACE", "OFF"]
var host = "localhost";
var port = "9500";
var error = false;
var client;

var constants = {
    beanName: "xmatters.log:type=logging,name=config"
}
router.post('/host', function(req, res) {
    console.log("new host:" + req.body.host + " new port:" + req.body.port);
    host = req.body.host;
    port = req.body.port;
    res.redirect("/logconfig");
});

router.post('/update', function(req, res) {
    console.log("new host:" + req.body.level + " new port:" + req.body.logger);
    setLogLevel(client, req.body.logger, req.body.level).then(function() {
        res.redirect("/logconfig");
    });
});

router.get('/', function(req, res) {
    getLogs(host, function(logs) {
        error = logs.length == 0;
        res.render('logInfo', {
            "attributes": attributes,
            "levels" : levels,
            "logs": logs.sort(function(o1, o2) {
                return o1.Name.localeCompare(o2.Name);
            }),
            "port" : port,
            "host" : host,
            "error" : error
        });
    });
});

var setLogLevel = function(client, logger, level) {
    var deferred = Q.defer();
    client.invoke(constants.beanName, "setLogLevel", [logger, level],
        function() {
            deferred.resolve();
        });
    return deferred.promise;
};

var retrieveLogs = function(client) {
    var deferred = Q.defer();
    client.invoke(constants.beanName, "getLoggers", null,
        function(logs) {
            deferred.resolve(logs);
        });
    return deferred.promise;
};

var extractLogInfo = function(logsArray) {
    var allLogs = [];
    var logsStringFormat = logsArray.toString();
    logsStringFormat = logsStringFormat.substring(1, logsStringFormat.length - 1);
    var logs = logsStringFormat.split(',');
    for (var i in logs) {
        var logInfo = {};
        var kv = logs[i].split('=');
        if (kv.length > 1) {
            logInfo.Name = kv[0].trim();
            logInfo.Level = kv[1].trim();
            allLogs.push(logInfo);
        }
    }

    return allLogs;
}

function getLogs(host, callback) {
    client = jmx.createClient({
        service: "service:jmx:rmi:///jndi/rmi://".concat(host).concat(":").concat(port).concat("/jmxrmi")
    });

    client.connect();

    client.on("connect", function () {
        console.log("connected");
        retrieveLogs(client).then(function (logs) {
            console.log("got logs: " + logs);
            callback(extractLogInfo(logs));
        });
    });

    client.on("error", function (err) {
        console.log(err);
        callback([]);
    })
}

module.exports = router;
