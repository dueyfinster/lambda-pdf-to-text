#!/bin/bash
source .env

request(){
  curl -F 'file=@/home/ngrogan/repos/lambda-pdf/test/li-test.pdf' $URL
}

deploy(){
  FUNCTION_NAME="pdf"
  ZIP_NAME="fun.zip"

  # Remove any existing zip files
  rm *.zip

  # First zip up the files
  zip $ZIP_NAME index.js pdftotext -R node_modules/

  # Then upload using AWS CLI
  aws lambda update-function-code --function-name $FUNCTION_NAME --zip-file fileb://$ZIP_NAME --publish
  }

  logs(){

  log_group_name=$(aws logs describe-log-groups \
    --output text \
    --query 'logGroups[*].[logGroupName]')

  log_stream_names=$(aws logs describe-log-streams \
    --log-group-name "$log_group_name" \
    --output text \
    --query 'logStreams[*].logStreamName')
  echo log_stream_names="'$log_stream_names'"
  for log_stream_name in $log_stream_names; do
    aws logs get-log-events \
      --log-group-name "$log_group_name" \
      --log-stream-name "$log_stream_name" \
      --output text \
      --query 'events[*].message'
  done | less
}


while [[ $# -gt 0 ]]
do
key="$1"

case $key in
    -d|--deploy)
    deploy
    shift # past argument
    ;;
    -l|--logs)
    logs
    shift # past argument
    ;;
    -r|--request)
    request
    shift # past argument
    ;;
    --default)
    DEFAULT=YES
    ;;
    *)
            # unknown option
    ;;
esac
shift # past argument or value
done
