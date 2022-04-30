import { api, LightningElement, track } from 'lwc';
 
import submitDepartmentAction from '@salesforce/apex/lwcAppExampleApex.submitDepartmentAction';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import {NavigationMixin} from 'lightning/navigation';
 
 
export default class DepCreation extends NavigationMixin (LightningElement) {
 
    @track departmentObjName;
    @track departmentObjDescription;
    
    @track departmentRecoredId;
    @track errorMsg;
 
   departmentHandleChange(event){
        if(event.target.name == 'departmentName'){
        this.departmentObjName = event.target.value;  
        //window.console.log('scoreObName ##' + this.scoreObName);
        }
      if(event.target.name == 'departmentDescription'){
        this.departmentObjDescription = event.target.value;  
      }
 
      
      
 
 
 }
 
 submitAction(){
    submitDepartmentAction({departmentName:this.departmentObjName,departmentDescription:this.departmentObjDescription})
    .then(result=>{
        this.departmentRecoredId = result.Id;
        window.console.log('departmentRecoredId##Vijay2 ' + this.departmentRecoredId);       
        const toastEvent = new ShowToastEvent({
            title:'Success!',
            message:'Record created successfully',
            variant:'success'
          });
          this.dispatchEvent(toastEvent);
 
          /*Start Navigation*/
          this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: result.Id,
                objectApiName: 'Department__c',
                actionName: 'view'
            },
         });
         /*End Navigation*/
 
    })
    .catch(error =>{
       this.errorMsg=error.message;
       window.console.log(this.error);
    });
 
 }
}