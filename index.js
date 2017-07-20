const os = require('os');
const path = require('path');
const fs = require("fs");
const busboy = require('busboy');
process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT']

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS, POST',
  'Access-Control-Allow-Headers': 'Content-Type'
};

const write_s3 = (filePath, callback) => {
  const AWS = require('aws-sdk');

  AWS.config.region = 'eu-west-1';
  const s3 = new AWS.S3();
  console.log('Going to call S3');
  
  var params = {
      Bucket: 'gbspdf',
      Key: 'test.pdf',
      Body: fs.readFileSync(filePath),
      ContentType: 'application/octet-stream'
  };

  s3.upload(params, function (err, res) {               
    if(err)
      console.log("Error in uploading file on s3 due to "+ err)
    else    
      console.log("File successfully uploaded.")
    return callback('done',null)
  });
}

const get_pdf_text = (filePath, callback) => {
  console.log('Going to run pdftotext on: ' + filePath)
  const cmd = 'pdftotext '
  const opts = ' -enc UTF-8 - '
  const exec = require('child_process').exec
  const allCmd = cmd + '"' + filePath + '"' + opts;
  let result = '';
  console.log('PDF command will run: '  + allCmd)
  const child = exec(allCmd, (error) => {
    if(error){ context.fail({ statusCode: 500, body: error, headers }); }
  })

  // Log process stdout and stderr
  child.stderr.on('data', console.error)
  child.stdout.on('data', function(data) {
    result += data.toString();
  });
  child.on('close', function(code) {
    console.log('stdout result: ' + result);
    return callback(result);
  });
}

const write_file = (filename, data, callback) => {
  const filePath = path.join(os.tmpDir(), path.basename(filename));
  console.log('Going to write file to: ' + filePath);

  fs.writeFile(filePath, data, 'binary', function (err) {
    if (err) {
      console.error('Writing file failed: ', err);
    }
    console.log('File write succeeded: ' + data)
    return callback(filePath);
  });
}

const process_form = (contentType, event, context) => {
  var bb = new busboy({ headers: { 'content-type': contentType }});
  let filePath = '';

  bb.on('file', function (fieldname, file, filename, encoding, mimetype) {
    console.log('File [%s]: filename=%j; encoding=%j; mimetype=%j', fieldname, filename, encoding, mimetype);
    console.log("OS tmp dir ========> " + os.tmpDir());
    console.log("Base name ========> " + path.basename(filename));
    filePath = path.join(os.tmpDir(), path.basename(filename));
    console.log("Full path ========> " + filePath);
    file.pipe(fs.createWriteStream(filePath));

    // file
    // .on('data', data => );
    // .on('data', data => write_file(filename, data, (filePath) => get_pdf_text(filePath, (result, error) => context.succeed({ statusCode: 200, body: result, headers }))));
  })
  // .on('field', (fieldname, val) =>console.log('Field [%s]: value: %j', fieldname, val))
  .on('finish', () => write_s3(filePath, (result, error) => context.succeed({ statusCode: 200, body: result, headers })))
  .on('error', err => {
    console.error('failed', err);
    context.fail({ statusCode: 500, body: err, headers });
  });

  bb.end(event.body);
}

function handler(event, context) {
  // console.log('event ===> ' + JSON.stringify(event));
  // console.log('context ===> ' + JSON.stringify(context));
  var contentType = event.headers['Content-Type'] || event.headers['content-type'];
  console.log('Body Content is: ' + contentType);

  if(contentType === 'application/pdf'){
    console.log('Body Content type is PDF');
    
    write_file('test.pdf', Buffer.from(event.body, 'base64'), (filePath) => get_pdf_text(filePath, (result, error) => context.succeed({ statusCode: 200, body: result, headers })));
  }else if(/multipart\/form-data/.test(contentType) || /application\/x-www-form-urlencoded/.test(contentType)){
    console.log('Body is a form, will use Busboy to parse');
    process_form(contentType, event, context);
  } else {
    console.error('Content is not correct: ' + contentType);
    context.fail({ statusCode: 500, body: 'Content sent is not correct', headers });
  }
}

module.exports = { handler };



// exports.handler = (event, context, callback) => {
//   console.log('incoming: ', event)

//   if (!event.file) {
//       console.error('No file uploaded: ', event.file);
//       return callback('Please upload a pdf file to use');
//   }
	
    
// }
