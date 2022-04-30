import { LightningElement, track, wire } from 'lwc';
import getCustomLookupUser from '@salesforce/apex/lwcApexController.getCustomLookupUser';
 
export default class LwcUserCostumLookup extends LightningElement {
    
 @track userName='';
 @track userList=[];
 @track objectApiName='User';
 @track userId;
 @track isShow=false;
 @track messageResult=false;
 @track isShowResult = true;
 @track showSearchedValues = false;
 @wire(getCustomLookupUser,{depName:'$userName'})
 retrieveAccounts ({error,data}){
     this.messageResult=false;
     if(data){
         console.log('data## ' + data.length);
         if(data.length>0 && this.isShowResult){
            this.userList =data;
            this.showSearchedValues=true;
            this.messageResult=false;
         }
         else if(data.length == 0){
            this.userList=[];
            this.showSearchedValues=false;
            if(this.userName != ''){
               this.messageResult=true;
            }
         }
         else if(error){
             this.userId='';
             this.userName='';
             this.userList=[];
             this.showSearchedValues=false;
             this.messageResult=true;
         }
 
     }
 }
 
 
 
 searchHandleClick(event){
  this.isShowResult = true;
  this.messageResult = false;
}
 
 
searchHandleKeyChange(event){
  this.messageResult=false;
  this.userName = event.target.value;
}
 
parentHandleAction(event){        
    this.showSearchedValues = false;
    this.isShowResult = false;
    this.messageResult=false;
    //Set the parent calendar id
    this.userId =  event.target.dataset.value;
    //Set the parent calendar label
    this.userName =  event.target.dataset.label;      
    console.log('userId::'+this.userId);    
    const selectedEvent = new CustomEvent('selected', { detail: this.userId });
        // Dispatches the event.
    this.dispatchEvent(selectedEvent);    
}
 
}