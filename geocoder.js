/**
 * Geos batch splices activation.
 *
 * @copyright 2014 Vocus Communications Ltd.
 * @author Guillaume de Boyer <guillaume.deboyer@vocus.com.au>
 */

var async = require('async'),
		progress = require('progress'),
		fs = require('fs'),
		geocoder = require('geocoder');


// Define parameters
var defineArguments = function(argv, callback) {

	var params = {
		format: 'csv',
		loc: 'loc',
		output: 'result'
	}, err;

	for (var i = 0; i < argv.length ; i++) {
		if ( argv[i] === '-f' || argv[i] === '--format' ) {
			if ( argv[i+1] ) {
				if ( argv[i+1] === 'csv' || argv[i+1] === 'geojson' ) {
					params.format = argv[i+1];
				} else {
					err = new Error(argv[i+1] + ' is not a valid format.');
				}
			}
		} else if ( argv[i] === '-o' || argv[i] === '--output' ) {
			if ( argv[i+1] ) {
				params.ouput = argv[i+1];
			}
		} else if ( argv[i] === '-l' || argv[i] === '--location-field' ) {
			if ( argv[i+1] ) {
				params.loc = argv[i+1];
			}
		}
	}

	params.input = argv[argv.length-1];

	return callback(err, params);

};


// Make sure we got a filename on the command line.
if (process.argv.length < 3) {
	console.log(' Usage: node ' + process.argv[2] + ' FILENAME');
	process.exit(1);
}

defineArguments(process.argv, function(err, params) {

	fs.readFile(params.input, 'utf8', function(err, data) {

		if (err) throw err;

		var rows = data.split('\r\n');

		var bar = new progress(':current/:total locations [:bar] :elapseds (:etas)', {
			total: rows.length,
			width: 30,
			complete: '=',
			incomplete: ' '
		});

		var stream = fs.createWriteStream(params.output + '.' + params.format);

		stream.once('open', function() {

			stream.write('address_out;lat;lng;type\r\n');

			async.eachSeries(rows, function(row, callback) {
				// Geocoding
				if(row !== '') {
					geocoder.geocode(row, function (err, data) {
						if (data.status !== 'OK' ) {
							return callback(data.error_message);
						}

						if (data.results) {
							var r = data.results[0];
							var geom = r.geometry;
							var string = r.formatted_address + ';' +
									geom.location.lat + ';' + geom.location.lng + ';' +
									geom.location_type +'\r\n';

							stream.write(string);

						}
						bar.tick();
						return callback();
					});
				}
			}, function(err) {
				if(err) throw (err);
				stream.end();
			});
		});

	});

});


