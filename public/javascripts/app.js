$(document).ready(function() {
    function update(logger, level) {
        $.post("/logconfig/update", { logger: logger, level: level}, function (data) {
                console.info(logger + " level changed to " + level);
            })
            .fail(function (data) {
                console.info(logger + " level failed to change to " + level);
            });
    }

    $('select').on('change', function() {
        var logger = $(this).parent().parent().find('[id^="log"]').html();
        var level = $(this).val();
        update(logger, level);
    });

    $('#add').click(function(event) {
        var url = "/logconfig/host";
        var logger = $("#logger").val();
        var level = $("#level").val()
        update(logger, level);
        event.preventDefault();
    });

    $('#server').click(function(event) {
        var url = "/logconfig/host";
        var host = $("#host").val();
        var port = $("#port").val()
        $.post(url, { host: host, port: port}, function (data) {
                console.info(logger + " level changed to " + level);
            })
            .fail(function (data) {
                console.info(logger + " level failed to change to " + level);
            });
        event.preventDefault();
    });
});