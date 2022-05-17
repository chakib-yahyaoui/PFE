import { LightningElement,api,wire,track } from 'lwc';
import opportunityAggregation from '@salesforce/apex/OpportunityDataService.aggregateOpportunitiees'
export default class Opp_chartOpportunities extends LightningElement {
  @api recordId; //As the component is loaded on a account detail page, we will get access to the account Id.
  @track opportunityData=[];//Chart accepts data in multiple formats, array, object etc. We are using array here. 
  //get the data from the backend
  @wire(opportunityAggregation,{}) opptyData({error, data}){
    if(data){
      let oppData = Object.assign({},data);
      /*
        this.opportunityData will in the below format
        [['Closed Won',2],['Closed Lost',4],['Negotiation',5]];
      */
      for(let key in oppData){
        if(oppData.hasOwnProperty(key)){
          let tempData=[key, oppData[key]];
          this.opportunityData.push(tempData);
        }
      }
    }
    if(error)
      console.log(error);
  }

}