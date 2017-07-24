const multipart = require("parse-multipart");
process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'] + '/dist/'
import PDFToText from './src/pdf';
import FormHandler from './src/form-handler';
import Bills from './src/bills';
import Dropbox from './src/dropbox';
import bills_config from './config';


const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS, POST',
  'Access-Control-Allow-Headers': 'Content-Type'
};

function processPayload(event){
  const result = {};
  const contentType = event.headers['content-type'] || event.headers['Content-Type'];

  if(contentType === 'application/pdf'){
    result.filename = 'test.pdf'
    result.data = new Buffer(event.body,'base64');
    return result;
  }

  if(event.hasOwnProperty('body-json')) {
    var bodyBuffer = new Buffer(event['body-json'].toString(),'base64');
    var boundary = multipart.getBoundary(event.params.header['content-type']);
    var parts = multipart.Parse(bodyBuffer,boundary)[0];
    return parts;
  }
}

exports.handler = async (event, context, callback) => {
  try {

    console.log(`Event is: ${JSON.stringify(event)}`);
    const config = processPayload(event);
    console.log('Form Response is: ' + JSON.stringify(config));

    const controller = new PDFToText(config);
    const pdfResp = await controller.run();
    console.log(`PDF Response is: ${pdfResp}`);

    const bi = new Bills(pdfResp.text, bills_config['bills']);
    const res = await bi.run();
    console.log(`Bill Response is: ${JSON.stringify(res)}`);

    const db = new Dropbox(bills_config['DB_TOKEN']);
    const dbResp = await db.upload(res.path, config.data)
    console.log(`Dropbox Response is: ${JSON.stringify(dbResp)}`);

    return context.succeed({ statusCode: 200, body: pdfResp.text, headers: headers });

  } catch (e) {
    console.log(`Application ERROR: ${e.stack}`);
    return context.fail({ statusCode: 500, body: `Application Error: ${e}`, headers });
  }
};
