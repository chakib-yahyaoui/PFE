import Password from '@salesforce/schema/Org__c.Password__c';
import Url from '@salesforce/schema/Org__c.Url__c';
import Login from '@salesforce/schema/Org__c.Login__c';
import Propritaire from '@salesforce/schema/Org__c.Propritaire__c';
import Secret_Word from '@salesforce/schema/Org__c.Secret_Word__c';
import Backup_Manager from '@salesforce/schema/Org__c.Backup_Manager__c';
import CreatedById from '@salesforce/schema/Org__c.CreatedById';
import Email_a_prevenir from '@salesforce/schema/Org__c.Email_a_prevenir__c';
import Noms_de_domaine from '@salesforce/schema/Org__c.Noms_de_domaine__c';
import SSO_Contact from '@salesforce/schema/Org__c.SSO_Contact__c';
import Domain_Custom from '@salesforce/schema/Org__c.Domain_Custom__c';
import SSO_Server from '@salesforce/schema/Org__c.SSO_Server__c';
import Token from '@salesforce/schema/Org__c.Token__c';
import Type from '@salesforce/schema/Org__c.Type__c';
import Version from '@salesforce/schema/Org__c.Version__c';
import OrgName from '@salesforce/schema/Org__c.Name';
import archive from '@salesforce/schema/Org__c.archive__c';
import { LightningElement, api ,track} from 'lwc';
import { refreshApex } from '@salesforce/apex';
import LastModifiedBy from '@salesforce/schema/Org__c.LastModifiedById';
export default class LwcAccordionSection extends LightningElement {
    info = [OrgName,Login,Password ,Secret_Word,Type,Url,archive,Domain_Custom ,Backup_Manager,Propritaire];
    sso=[SSO_Server,SSO_Contact];
    support= [Noms_de_domaine,Email_a_prevenir,CreatedById,LastModifiedBy];
   information=[Version,Token];
   activeSections = ['information','sso','support'];
    activeSectionsMessage = '';
@api objectApiName;


    toggleSectionHandleW3web(event) {
        const openSections = event.detail.openSections;
 
        if (openSections.length === 0) {
            this.activeSectionsMessage = 'All sections are closed';
        } else {
            this.activeSectionsMessage =
                'Open sections: ' + openSections.join(', ');
        }
    }
@track wiredDataResult;
        @api org ={};
        result;
        @api recordId;
        @track recordId;
      
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