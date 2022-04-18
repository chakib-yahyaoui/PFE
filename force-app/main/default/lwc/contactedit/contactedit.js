import { LightningElement,api } from 'lwc';
import NAME_FIELD from '@salesforce/schema/Contact.Name'
import EMAIL_FIELD from '@salesforce/schema/Contact.Email'
export default class Contactedit extends LightningElement {
    fields = [NAME_FIELD, EMAIL_FIELD];
    @api recordId;
    @api objectApiName
}