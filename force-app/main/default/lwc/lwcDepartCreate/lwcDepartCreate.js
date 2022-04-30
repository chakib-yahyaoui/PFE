import { LightningElement, track } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import DEPARTMENT_OBJECT from '@salesforce/schema/Department__c';
import departmentName from '@salesforce/schema/Department__c.Name';
import description from '@salesforce/schema/Department__c.Description__c';
import managerFieldId from '@salesforce/schema/Department__c.Manager__c';
import memberFieldId from '@salesforce/schema/Department__c.Member__c';
import projectManagerFieldId from '@salesforce/schema/Department__c.Project_Managers__c';

export default class LwcDepartCreate extends NavigationMixin(LightningElement) {
    @track selectedUserId;
    @track departmentId;    
    departmentName = '';   
    descriptionName = '';  
    departmentHandleChange(event) {
        console.log(event.target.label);
        console.log(event.target.value);        
        if(event.target.label=='Department Name'){
            this.departmentname = event.target.value;
        }
        if(event.target.label=='Description '){
            this.description = event.target.value;
        }   
        
        
                   
    }

    createLookupDepartmentAction(){
        
        const fields = {};
        fields[departmentName.fieldApiName] = this.departmentName;
        fields[description.fieldApiName] = this.description;
        
        const recordInput = { apiName: DEPARTMENT_OBJECT.objectApiName, fields };

        
        createRecord(recordInput)
            .then(departmentobj=> {
                this.departmentId = departmentobj.id;
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
                        recordId: departmentobj.id,
                        objectApiName: 'Department__c',
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
   
}