import { LightningElement, track, api } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import contactFirstName from '@salesforce/schema/Contact.FirstName';
import contactLastName from '@salesforce/schema/Contact.LastName';
import contactPhone from '@salesforce/schema/Contact.Phone';
import contactEmail from '@salesforce/schema/Contact.Email';
import accountFieldId from '@salesforce/schema/Contact.AccountId';

export default class LwcCreateContactCustomLookup extends NavigationMixin(LightningElement) {   
    @track selectedAccountId;
    @track contactId;    
    firstname = '';   
    lastname = '';  
    phoneNo = '';
    emailId = '';
    @api show() {
        this.showModal = true;
      }
      handleDialogClose() {
        this.showModal = false;
      }
    contactHandleChange(event) {
        console.log(event.target.label);
        console.log(event.target.value);        
        if(event.target.label=='First Name'){
            this.firstname = event.target.value;
        }
        if(event.target.label=='Last Name'){
            this.lastname = event.target.value;
        }   
        
        if(event.target.label=='Phone'){
            this.phoneNo = event.target.value;
        }

        if(event.target.label=='Email'){
            this.emailId = event.target.value;
        }
                   
    }

    createLookupContactAction(){
        console.log(this.selectedAccountId);
        const fields = {};
        fields[contactFirstName.fieldApiName] = this.firstname;
        fields[contactLastName.fieldApiName] = this.lastname;
        fields[contactPhone.fieldApiName] = this.phoneNo;
        fields[contactEmail.fieldApiName] = this.emailId;
        
        fields[accountFieldId.fieldApiName] = this.selectedAccountId;
        const recordInput = { apiName: CONTACT_OBJECT.objectApiName, fields };
        createRecord(recordInput)
            .then(contactobj=> {
                this.contactId = contactobj.id;
                this.fields={};
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Contact created successfully..!',
                        variant: 'success',
                    }),
                );
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: contactobj.id,
                        objectApiName: 'Contact',
                        actionName: 'view'
                    },
                });


            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
            });
    }
    myLookupHandle(event){
        console.log(event.detail);
        this.selectedAccountId = event.detail;
    }
}