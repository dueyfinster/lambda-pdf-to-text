#!/bin/bash
FUNCTION_NAME="pdf"
ZIP_NAME="fun.zip"

# Remove any existing zip files
rm *.zip

# First zip up the files
zip $ZIP_NAME index.js node_modules/ pdftotext

# Then upload using AWS CLI
aws lambda update-function-code --function-name $FUNCTION_NAME --zip-file fileb://$ZIP_NAME

