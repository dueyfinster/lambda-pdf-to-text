
/**
* Given text from a bill, it searches for accounts that match, and 
* returns information representing the bill
*/
export default class Bills {

  constructor(text, config){
    this.text = text;
    this.config = config;
    console.log(`Init bills ${JSON.stringify(this.config)}`)
  }


  search_text_for_account(){
    for(let i in this.config){
      const accObj = this.config[i];
      console.log(`Checking account ${JSON.stringify(accObj.bill_type)}`);
      if(this.text.includes(accObj.acc_no)){
        console.log(`Account matched for: ${JSON.stringify(accObj.bill_type)}`);
      }
    }

  }

  retrieve_bill_date(){
    console.log('TODO');
  }

  async run(){
    this.search_text_for_account();
  } 
}
