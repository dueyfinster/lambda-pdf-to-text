const fs = require("fs");
const os = require('os');
const path = require('path');
const exec = require('child_process').exec

/**
 * Transform a PDF to Text
 */
export default class PDFToText
{
  /**
   * @param {fileName} - name of the file
   * @param {fileData} - a buffer representing file contents
   */
  constructor(config) {
    this.fileName = config.filename;
    this.fileData = config.data;
    this.filePath = path.join(os.tmpDir(), path.basename(this.fileName));
    console.log(`PDFToText init with: ${this.fileName} ${this.filePath} ${JSON.stringify(this.fileData)}`);
  }

  async write_s3(filePath) {
    return new Promise((resolve, reject) => {
      const AWS = require('aws-sdk');

      AWS.config.region = 'eu-west-1';
      const s3 = new AWS.S3();
      console.log('Going to call S3');
      
      var params = {
          Bucket: 'gbspdf',
          Key: 'test.pdf',
          Body: fs.readFileSync(filePath),
          ContentType: 'application/octet-stream'
      };

      s3.upload(params, function (err, res) {               
        if(err) {
          console.log("Error in uploading file on s3 due to "+ err)
          reject(err);
        } else {    
          console.log("File successfully uploaded.")
          resolve();
        }
      });
    });
  }
  /**
  * Write a buffer to disk
  * @param {filePath} - path to the file
  * @param {fileData} - the buffer to be written to disk
  */
  async write_file(filePath, fileData){
    return new Promise(function(resolve, reject) {
      console.log(`Will write file: ${filePath} with data: ${JSON.stringify(fileData)}`);
      fs.writeFile(filePath, fileData, 'binary', function (err) {
        if (err) { reject('Writing file failed: ' + err) }
        console.log('Wrote pdf file to: ' + filePath);
        resolve();
      });
    });
  }

  /**
   * Runs `pdftotext` command on a filePath of a PDF
   * @param {filePath}
   * @return {String} - represents the text of the PDF file
   */
  async get_text(filePath) {
    return new Promise(function(resolve, reject) {
      console.log('Going to run pdftotext on: ' + filePath);
      console.log('System Path: ' + process.env.PATH);
      const cmd = 'pdftotext '
      const opts = ' - '
      const allCmd = cmd + '"' + filePath + '"' + opts;
      let result = '';
      
      const child = exec(allCmd);

      // Log process stdout and stderr
      child.stderr.on('data', function (error){ 
        throw new Error(`Failed to run command: ${allCmd} with error: ${error}`) 
      });
      child.stdout.on('data', function(data) {
        result += data.toString();
      });
      child.on('close', function(code) {
        console.log('stdout result: ' + result);
        resolve(result);
      });
    });
  }


  /**
   * Runs the action
   * @return {pdfText} - A string representing text of a PDF
   */
  async run() {
    await this.write_file(this.filePath, this.fileData);
    // await this.write_s3(this.filePath);
    const pdfText = await this.get_text(this.filePath);
    console.log('Returning from PDFToText: ' + pdfText);

    return { "text": pdfText, "path": this.filePath };
  }
}
