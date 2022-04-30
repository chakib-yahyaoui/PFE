import { LightningElement,track,api } from 'lwc';
import DEPARTMENT_OBJECT from '@salesforce/schema/Department__c';
import NAME_FIELD from '@salesforce/schema/Department__c.Name';
import DESCRIPTION_FIELD from '@salesforce/schema/Department__c.Description__c';
import MANAGER_FIELD from '@salesforce/schema/Department__c.Manager__c';
import MEMBER_FIELD from '@salesforce/schema/Department__c.Member__c';
import PROJECT_MANAGER_FIELD from '@salesforce/schema/Department__c.Project_Managers__c';
export default class DepartmentForm extends LightningElement {
    @track fileds=[NAME_FIELD,DESCRIPTION_FIELD,MANAGER_FIELD,MEMBER_FIELD,PROJECT_MANAGER_FIELD];
    objectApiName = DEPARTMENT_OBJECT;
    @api recordId
    
}