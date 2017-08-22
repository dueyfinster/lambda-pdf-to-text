const multipart = require('parse-multipart');
process.env['PATH'] =
  process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'] + '/dist/';
const log = require('winston');
log.level = process.env.LOG_LEVEL;
import PDFToText from './src/pdf';

function processPayload(event) {
  const result = {};
  const contentType =
    event.headers['content-type'] || event.headers['Content-Type'];

  if (contentType === 'application/pdf') {
    result.filename = 'test.pdf';
    result.data = new Buffer(event.body, 'base64');
    return result;
  }

  if (event.hasOwnProperty('body-json')) {
    var bodyBuffer = new Buffer(event['body-json'].toString(), 'base64');
    var boundary = multipart.getBoundary(event.params.header['content-type']);
    var parts = multipart.Parse(bodyBuffer, boundary)[0];
    return parts;
  }
}

exports.handler = async (event, context, callback) => {
  try {
    log.debug(`Event is: ${JSON.stringify(event)}`);
    const config = processPayload(event);
    log.debug('Form Response is: ' + JSON.stringify(config));

    const controller = new PDFToText(config);
    const pdfResp = await controller.run();
    log.debug(`PDF Response is: ${pdfResp}`);

    return context.succeed({
      statusCode: 200,
      body: pdfResp.text,
      headers: {'Content-Type': 'application/json'}
    });
  } catch (e) {
    log.error(`Application ERROR: ${e.stack}`);
    return context.fail({
      statusCode: 500,
      body: `Application Error: ${e}`,
      headers
    });
  }
};
