import DBX from 'dropbox';

export default class Dropbox  {

  constructor(token){
    this.dbx = new DBX({ accessToken: token });
  }


  download(){
    console.log('TODO!');
  }


  upload(filePath, fileData){
    return this.dbx.filesUpload({path: '/Documents/Financial/Bills/' + filePath, contents: fileData})
      .then(function(response) {
	console.log(response);
        return true;
      })
      .catch(function(error) {
	console.error(error);
        return false;
      });
  }

}
