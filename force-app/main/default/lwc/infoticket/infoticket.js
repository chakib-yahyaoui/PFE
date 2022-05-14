import { LightningElement, api ,track } from 'lwc';
import Status  from '@salesforce/schema/Ticket__c.Status__c';
import Client  from '@salesforce/schema/Ticket__c.Compte_Client__c';
import Contrat  from '@salesforce/schema/Ticket__c.Contrat_TMA_actif__c';
import Nticket  from '@salesforce/schema/Ticket__c.N_Ticket__c';
import project  from '@salesforce/schema/Ticket__c.Project__c';
import ref  from '@salesforce/schema/Ticket__c.Ticket_ref__c';
import test  from '@salesforce/schema/Ticket__c.Sc_nario_de_test__c';
import parent  from '@salesforce/schema/Ticket__c.Ticket_parent__c';
import TicketName from '@salesforce/schema/Ticket__c.Name';
import Priority from '@salesforce/schema/Ticket__c.Priority__c';
import { refreshApex } from '@salesforce/apex';
export default class Infoticket extends LightningElement {
    @api ticket ={};
    info=[TicketName,Nticket,parent,Client,ref,project,Contrat,Status,test,Priority]

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