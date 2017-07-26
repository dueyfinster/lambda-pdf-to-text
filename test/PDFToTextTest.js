import chai from 'chai';
import PDFToText from './../src/pdf';
import fs from 'fs';
const assert = chai.assert;
const instance = new PDFToText({filename: 'test.pdf', data: fs.readFileSync('test/test.pdf')});

describe('PDFToText', () => {
  describe('#run', () => {
    it('should correctly return text of PDF and filepath', async () => {
      const response = await instance.run();
      assert.isNotNull(response.text, 'PDF text is null');
      assert.include(response.text, 'Lorem ipsum dolor', 'PDF does not contain the correct text');
      assert.isNotNull(response.path, 'PDF path is null');
      assert.include(response.path, 'test.pdf', 'PDF path does not include file name');
    });
  });
});
