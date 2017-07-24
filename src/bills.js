export default class Bills {

  constructor(text, config){
    this.text = text;
    this.config = config;
  }


  search_text_for_account(){
    for(let accountObj in this.config){
      console.log(`Checking account ${JSON.stringify(accountObj)}`)
    }

  }

  retrieve_bill_date(){

  }

  async run(){
    this.search_text_for_account();
  } 
}
