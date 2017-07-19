process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT']
const exec = require('child_process').exec
const fs = require("fs")
const cmd = 'pdftotext'
const opts = ' -enc UTF-8 - '

exports.handler = (event, context, callback) => {
  console.log('incoming: ', event)
  if (!event.file) {
      console.error('No file uploaded: ', event.file);
      return callback('Please upload a pdf file to use');
  }
	
  fs.writeFile("/tmp/test.pdf", event.pdf, function (err) {
    if (err) {
      console.error('Writing file failed: ', err);
      return callback("writeFile failed: " + err);
    } else {
      //context.succeed("writeFile succeeded")
      const child = exec(cmd + ' ./test/li-test.pdf ' + opts, (error) => {
        // Resolve with result of process
        callback(error, 'Process complete!');
      })

      // Log process stdout and stderr
      child.stdout.on('data', console.log)
      child.stderr.on('data', console.error)
    }
  });

    
}
