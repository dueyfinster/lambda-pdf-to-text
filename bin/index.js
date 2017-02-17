process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT']
const exec = require('child_process').exec
const cmd = 'pdftotext'
const opts = ' -enc UTF-8 - '

exports.handler = (event, context, callback) => {
	console.log('incoming: ', event)

	if (!event.file) {
        return callback('Please upload a pdf file to use');
    }

    const child = exec(cmd + event.file + opts, (error) => {
        // Resolve with result of process
        callback(error, 'Process complete!');
    });

    // Log process stdout and stderr
    child.stdout.on('data', console.log);
    child.stderr.on('data', console.error);
}
