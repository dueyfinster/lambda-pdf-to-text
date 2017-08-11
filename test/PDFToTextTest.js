import chai from 'chai';
import PDFToText from './../src/pdf';
import fs from 'fs';
const assert = chai.assert;
const isWin = require('os').platform().indexOf('win') > -1;
const where = isWin ? 'where' : 'whereis';
const exec = require('child_process').exec

describe('PDFToText#run with valid PDF', () => {

    const instance = new PDFToText({filename: 'test.pdf', data: fs.readFileSync('test/test.pdf')});

    it('should have pdftotext in path', async () => {
      const child = exec(where + ' pdftotext');
      child.on('close', function(code) {
        assert.equal(code, 0, 'pdftotext is not in the PATH!');
      });
    });

    it('should correctly return text of PDF', async () => {
      const response = await instance.run();
      assert.isNotNull(response.text, 'PDF text is null');
      assert.include(response.text, 'Lorem ipsum dolor', 'PDF does not contain the correct text');
    });

    it('should correctly return filename in filepath of PDF', async () => {
      const response = await instance.run();
      assert.isNotNull(response.path, 'PDF path is null');
      assert.include(response.path, 'test.pdf', 'PDF path does not include file name');
    });

});

// describe('PDFToText#run with malformed PDF', () => {
//   const instance = new PDFToText({filename: 'malformed.pdf', data: fs.readFileSync('test/malformed.pdf')});
    
//     it('should not correctly return text of PDF', async () => {
//       try {
//         const response = await instance.run();
//       } catch (err) { 
//         console.log('IN CATCH!');
//         assert.include(err.message, 'Syntax Error', 'The wrong error is being given');
//       }
//     });
// });
