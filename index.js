process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'] + '/dist/'
import PDFToText from './src/pdf';

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS, POST',
  'Access-Control-Allow-Headers': 'Content-Type'
};

exports.handler = async (event, context, callback) => {
  try {

    const controller = new PDFToText('test.pdf', event.body);
    const response = await controller.run();
    console.log('Response is: ' + response);

    return context.succeed({ statusCode: 200, body: response, headers: headers });

  } catch (e) {
    console.log(`Application ERROR: ${e.stack}`);
    return context.fail('Application Error');
  }
};
