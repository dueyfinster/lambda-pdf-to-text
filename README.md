![AWS Lambda PDF to Text](logo.png "AWS Lambda PDF to Text")
# AWS Lambda PDF to Text
A web service that transforms a PDF to text using `pdftotext` on AWS Lambda.

## How to
1. Clone this repository
2. Get the [aws cli][] and login
3. [Create a Lambda function][] (create from scratch, use Node 6.10 and call it `pdf`) on AWS Lambda Console
4. Run `npm install` and then `npm run deploy` - Thats it! Your code is now on AWS Lambda.

[Create a Lambda function]: https://console.aws.amazon.com/lambda/home?region=us-east-1#/functions
[aws cli]: http://docs.aws.amazon.com/cli/latest/userguide/installing.html
