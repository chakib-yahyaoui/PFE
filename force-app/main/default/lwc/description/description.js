import { LightningElement ,api,track} from 'lwc';
import { refreshApex } from '@salesforce/apex';
import description from '@salesforce/schema/Ticket__c.Description__c';

export default class Description extends LightningElement {

    @api ticket ={};
    description=[description];
    @api recordId;
    @track recordId;
    @track wiredDataResult;
    @api objectApiName;
    activeSectionMessage = '';
    isDVisible = false;
 
    accordionToggleSectionW3web(event) {
        this.activeSectionMessage =
            'Open section name:  ' + event.detail.openSections;
    }
 
    toggleSectionJquery() {
        this.isDVisible = !this.isDVisible;
    }
 
    get isMessageVisible() {
        return this.activeSectionMessage.length > 0;
    }
    handleSubmit(event) {
        console.log('onsubmit event recordEditForm'+ event.detail.fields);
        refreshApex(this.wiredDataResult) 
    }
    handleSuccess(event) {
        console.log('onsuccess event recordEditForm', event.detail.id);
        refreshApex(this.wiredDataResult) 
    }
    renderedCallback(){
        refreshApex(this.wiredDataResult);
   }
   handleload(event){
       console.log(event.Type)
       console.log(event.detail)
   }
}