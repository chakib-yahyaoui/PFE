import { LightningElement ,api ,track } from 'lwc';

import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import Password from '@salesforce/schema/Org__c.Password__c';
import Url from '@salesforce/schema/Org__c.Url__c';
import Login from '@salesforce/schema/Org__c.Login__c';
import Propritaire from '@salesforce/schema/Org__c.Propritaire__c';
import Secret_Word from '@salesforce/schema/Org__c.Secret_Word__c';
import Backup_Manager from '@salesforce/schema/Org__c.Backup_Manager__c';
import CreatedById from '@salesforce/schema/Org__c.CreatedById';
import Type from '@salesforce/schema/Org__c.Type__c';
import OrgName from '@salesforce/schema/Org__c.Name';
import LastModifiedBy from '@salesforce/schema/Org__c.LastModifiedById';


import { CloseActionScreenEvent } from 'lightning/actions';
export default class Updateorg extends LightningElement {
    @api org ={};
    myFields = [OrgName,Login,Password, ,Secret_Word,Type,Url ,Backup_Manager,Propritaire,CreatedById,LastModifiedBy];
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

                message: 'Org Record Updated!',

                variant: 'success'

            })

        );

   }

}