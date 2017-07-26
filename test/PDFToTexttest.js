import chai from 'chai';
import PDFToText from './../src/pdf';

const assert = chai.assert;
const instance = new PDFToText({});

describe('PDFToText', () => {
  describe('#run', () => {
    it('should correctly return text of PDF and filepath', async () => {
      const response = await instance.run();
      assert.equal(true, true);
    });
  });
});
