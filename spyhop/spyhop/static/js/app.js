$(function () {

    var RELOAD = 5000, TIMEOUT = 2000, SHIFT = 20, PERCISION = 2;

    var SERIES = {};

    var table = $('#containers').DataTable({
	"ajax": "/api/ps",
	"columns": [
            { "title": "Container ID", "data": "Id" },
            { "title": "Image", "data": "Image" },
            { "title": "Command", "data": "Command" },
            { "title": "Created", "data": "Created" },
            { "title": "Status", "data": "Status" },
            { "title": "Ports", "data": "Ports[0].PublicPort" },
            { "title": "Names", "data": "Names" }
	],
        "aoColumnDefs": [{
            "aTargets": [ 0 ],
            "mRender": function (data, type, full) {
                return data.slice(0, 12);
            }
        }],
	"fnInitComplete": function (settings) {

            if (settings.json) {

		for (var i = 0; i < settings.json.data.length; i++) {

                    var hash = settings.json.data[i].Id.slice(0, 12);

                    SERIES[hash] = chart.addSeries({
                        name: settings.json.data[i].Names[0]
                    });

		}
		updateCharts();
		setInterval(updateCharts, TIMEOUT);
            }
	},

	"fnDrawCallback": function(settings) {

            if (settings.json) {

		for (var i = 0; i < settings.json.data.length; i++) {
                    console.log(settings.json.data[i].Id);
		}
            }
	}

    });

    setTimeout(function () {
	table.ajax.reload(null, false);
    }, RELOAD);


    function getStats(hash) {

        $.getJSON('/api/curated/' + hash, function (data) {

            var series = SERIES[hash], shift = series.data.length > SHIFT;
            series.addPoint(parseFloat(data.cpu_percent.toFixed(PERCISION)), true, shift);

        });

    }

    function updateCharts() {

	for (var hash in SERIES) {
            getStats(hash);
	}
    }

    var chart = new Highcharts.Chart({

	chart: {
            renderTo: 'charts'
	},
	credits: {
            enabled: false
	},

	title: {
            text : 'CPU %'
	},

	exporting: {
            enabled: false
	}

    });

});
