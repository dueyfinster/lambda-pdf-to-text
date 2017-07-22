process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'] + '/dist/'
import PDFToText from './src/pdf';
import FormHandler from './src/form-handler';

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS, POST',
  'Access-Control-Allow-Headers': 'Content-Type'
};

exports.handler = async (event, context, callback) => {
  try {

    const f = new FormHandler(event);
    const form = await f.run();
    console.log('Form Response is: ' + JSON.stringify(form));
    const controller = new PDFToText(form.filename, form.file);
    const response = await controller.run();
    console.log('PDF Response is: ' + response);

    return context.succeed({ statusCode: 200, body: response, headers: headers });

  } catch (e) {
    console.log(`Application ERROR: ${e.stack}`);
    return context.fail({ statusCode: 500, body: `Application Error: ${e}`, headers });
  }
};
