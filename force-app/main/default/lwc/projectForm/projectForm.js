import { LightningElement,track,api } from 'lwc';
import PROJECT_OBJECT from '@salesforce/schema/Project__c';
import NAME_FIELD from '@salesforce/schema/Project__c.Name';
import SPECIFICATION_FIELD from '@salesforce/schema/Project__c.Specifications__c';
import MEMBERS_FIELD from '@salesforce/schema/Project__c.Members__c';
import DATE_BEGIN_FIELD from '@salesforce/schema/Project__c.Date_begin__c';
import DATE_END_FIELD from '@salesforce/schema/Project__c.Date_end__c';

export default class ProjectForm extends LightningElement {
    @track fileds=[NAME_FIELD,SPECIFICATION_FIELD,MEMBERS_FIELD,DATE_BEGIN_FIELD,DATE_END_FIELD];
    objectApiName = PROJECT_OBJECT;
    @api recordId
    
}