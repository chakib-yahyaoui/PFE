import { LightningElement,api,track } from 'lwc';

export default class DepartmentDetail extends LightningElement {
    @api recordId
    @api objectApiName

    connectedCallbach(){
        this.objectApiName=this.objectApiName;
    }
}