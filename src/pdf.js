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
   * @param {object}
   */
  constructor(fileName, fileData) {
    this.fileName = fileName;
    this.fileData = Buffer.from(fileData, 'base64');
    this.filePath = path.join(os.tmpDir(), path.basename(this.fileName));
    console.log('PDFToText init with: ' + fileName + ' ' + this.filePath + ' ' + fileData);
  }

  async write_file(filePath, fileData){
    return new Promise(function(resolve, reject) {
      console.log('Will write file: ' + filePath + ' with data: ' + fileData);
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
    const pdfText = await this.get_text(this.filePath);
    console.log('Returning from PDFToText: ' + pdfText);

    return pdfText;
  }
}
