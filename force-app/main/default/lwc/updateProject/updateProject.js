import { LightningElement ,api ,track } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import Name  from '@salesforce/schema/Project__c.Name';
import Specifications  from '@salesforce/schema/Project__c.Specifications__c';
import Members  from '@salesforce/schema/Project__c.Members__c';
import Department  from '@salesforce/schema/Project__c.Department__c';
import Date_end  from '@salesforce/schema/Project__c.Date_end__c';
import Date_begin  from '@salesforce/schema/Project__c.Date_begin__c';


import CreatedById from '@salesforce/schema/Project__c.CreatedById';

import LastModifiedBy from '@salesforce/schema/Project__c.LastModifiedById';


import { CloseActionScreenEvent } from 'lightning/actions';

export default class UpdateProject extends LightningElement {
    @api department ={};
    myFields = [Name ,Specifications,Members,Member ,Department  ,Date_end,Date_begin,LastModifiedBy,CreatedById];
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

                message: 'Project Record Updated!',

                variant: 'success'

            })

        );

   }

}