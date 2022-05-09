import { LightningElement ,api ,track } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import Name  from '@salesforce/schema/Department__c.Name';
import Description  from '@salesforce/schema/Department__c.Description__c';
import Manager  from '@salesforce/schema/Department__c.Manager__c';
import Member  from '@salesforce/schema/Department__c.Member__c';
import Project_Managers  from '@salesforce/schema/Department__c.Project_Managers__c';


import CreatedById from '@salesforce/schema/Department__c.CreatedById';

import LastModifiedBy from '@salesforce/schema/Department__c.LastModifiedById';


import { CloseActionScreenEvent } from 'lightning/actions';
export default class UpdateDepartment extends LightningElement {
    @api department ={};
    myFields = [Name ,Description,Manager,Member ,Project_Managers  ,LastModifiedBy,CreatedById];
 result;
 @api recordId;
 @track recordId;
   @track wiredDataResult;
   @api objectApiName;
handleSubmit(event) {
    console.log('onsubmit event recordEditForm'+ event.detail.fields);
    refreshApex(this.wiredDataResult) 
}
handleload(event){
    console.log(event.Type)
    console.log(event.detail)
}
   handleSuccess() {

// Close the modal window and display a success toast

        this.dispatchEvent(new CloseActionScreenEvent());

        this.dispatchEvent(

            new ShowToastEvent({

                title: 'Success',

                message: 'Department Record Updated!',

                variant: 'success'

            })

        );

   }

}
