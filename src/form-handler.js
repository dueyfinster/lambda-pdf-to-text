const Busboy = require('busboy');
const path = require('path');
const os = require('os');

export default class FormHandler {

  constructor(event){
    this.event = event;
  }

  async handler(event) {
    return new Promise((resolve, reject) => {
      const result = {}; 
      var contentType = event.headers['Content-Type'] || event.headers['content-type'];
      if(contentType == 'application/pdf'){
        result.file = Buffer.from(event.body, 'base64');
        result.filename = 'test.pdf';
        resolve(result);
      }
      var bb = new Busboy({ headers: { 'content-type': contentType }});

      bb.on('file', function (fieldname, file, filename, encoding, mimetype) {
	console.log('File [%s]: filename=%j; encoding=%j; mimetype=%j', fieldname, filename, encoding, mimetype);

	file
	.on('data', data => result.file = data)
	.on('end', () => { 
              result.filename = filename;
	      result.contentType = mimetype;
            });
        })
      .on('field', (fieldname, val) => result[fieldname] = val)
      .on('finish', () => {
	console.log('Done parsing form!');
        resolve(result);
      })
      .on('error', err => {
	console.log('failed', err);
        reject(`Parse error: ${err}`);
      });

      bb.end(event.body);
    });
  }

  async run(){
    return this.handler(this.event);
  }

}
