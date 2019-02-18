![AWS Lambda PDF to Text](logo.png "AWS Lambda PDF to Text")
# AWS Lambda PDF to Text
A web service that transforms a PDF to text using `pdftotext` on AWS Lambda.

## How to deploy
1. Clone this repository
2. Get the [aws cli][] and login
3. [Create a Lambda function][] (create from scratch, use Node 6.10 and call it `pdf`) on AWS Lambda Console
4. Run `npm install` and then `npm run deploy` - Thats it! Your code is now on AWS Lambda.

## How to use
1. Install [curl][]
2. Send a request like (where `myfile.pdf` is your pdf filename): 
`curl -X POST -H 'Content-Type: application/pdf' --data-binary @<myfile.pdf> https://<my_aws_lambda_url>`
3. You will get the text of the PDF sent back!

[Create a Lambda function]: https://console.aws.amazon.com/lambda/home?region=us-east-1#/functions
[aws cli]: http://docs.aws.amazon.com/cli/latest/userguide/installing.html
[curl]: https://curl.haxx.se/
