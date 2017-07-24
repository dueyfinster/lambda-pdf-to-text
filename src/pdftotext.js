function handler(event, context) {
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

module.exports = { handler };

