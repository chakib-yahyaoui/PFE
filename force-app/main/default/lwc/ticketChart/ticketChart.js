import { LightningElement,api,wire,track } from 'lwc';
import ticketAggregation from '@salesforce/apex/TicketChart.aggregatTickets'
export default class TicketChart extends LightningElement {
    @api recordId;
    @track ticketData=[];//Chart accepts data in multiple formats, array, object etc. We are using array here. 
  //get the data from the backend
  @wire(ticketAggregation,{}) ticketData({error, data}){
    if(data){
      let ticData = Object.assign({},data);
     
      for(let key in ticData){
        if(ticData.hasOwnProperty(key)){
          let tempData=[key, ticData[key]];
          this.ticketData.push(tempData);
        }
      }
    }
    if(error)
      console.log(error);
  }
}