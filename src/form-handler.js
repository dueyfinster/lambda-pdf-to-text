export default class FormHandler {

  constructor(event, context){
    // console.log('event ===> ' + JSON.stringify(event));
    // console.log('context ===> ' + JSON.stringify(context));
    var contentType = event.headers['Content-Type'] || event.headers['content-type'];
    console.log('Body Content is: ' + contentType);

    if(contentType === 'application/pdf'){
      console.log('Body Content type is PDF');
      
      write_file('test.pdf', Buffer.from(event.body,'base64'), (filePath) => get_pdf_text(filePath, (result, error) => context.succeed({ statusCode: 200, body: result, headers })));
    }else if(/multipart\/form-data/.test(contentType) || /application\/x-www-form-urlencoded/.test(contentType)){
      console.log('Body is a form, will use Busboy to parse');
      process_form(contentType, event, context);
    } else {
      console.error('Content is not correct: ' + contentType);
      context.fail({ statusCode: 500, body: 'Content sent is not correct', headers });
    }
  }


  async process_form(contentType, event, context){
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
}
