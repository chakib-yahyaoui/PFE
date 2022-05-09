import { LightningElement ,api ,track } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import Status  from '@salesforce/schema/Ticket__c.Status__c';
import commentaire  from '@salesforce/schema/Ticket__c.Commentaire__c';
import Client  from '@salesforce/schema/Ticket__c.Compte_Client__c';
import Contrat  from '@salesforce/schema/Ticket__c.Contrat_TMA_actif__c';
import prisecharge  from '@salesforce/schema/Ticket__c.Date_et_heure_de_prise_en_charge__c';
import reception  from '@salesforce/schema/Ticket__c.Date_et_heure_de_r_ception__c';
import end  from '@salesforce/schema/Ticket__c.End_Date__c';
import equipe  from '@salesforce/schema/Ticket__c.Equipe_de_traitement__c';
import reproduction  from '@salesforce/schema/Ticket__c.Equipe_de_traitement__c';
import module  from '@salesforce/schema/Ticket__c.Module_concern__c';
import Nticket  from '@salesforce/schema/Ticket__c.N_Ticket__c';
import project  from '@salesforce/schema/Ticket__c.Project__c';
import test  from '@salesforce/schema/Ticket__c.Sc_nario_de_test__c';
import sendfrom  from '@salesforce/schema/Ticket__c.Send_from__c';
import Suivipar  from '@salesforce/schema/Ticket__c.Suivi_par__c';
import parent  from '@salesforce/schema/Ticket__c.Ticket_parent__c';
import ref  from '@salesforce/schema/Ticket__c.Ticket_ref__c';
import demande  from '@salesforce/schema/Ticket__c.Type_de_la_demande__c';

import resolution  from '@salesforce/schema/Ticket__c.Description_de_la_m_thode_de_r_solution__c';

import Type from '@salesforce/schema/Ticket__c.Type__c';
import Priority from '@salesforce/schema/Ticket__c.Priority__c';
import Affected_to from '@salesforce/schema/Ticket__c.Attribue__c';
import TicketName from '@salesforce/schema/Ticket__c.Name';
import Description from '@salesforce/schema/Ticket__c.Description__c';
import Criticité from '@salesforce/schema/Ticket__c.Criticit__c';
import Remark from '@salesforce/schema/Ticket__c.Remark__c';
import CreatedById from '@salesforce/schema/Org__c.CreatedById';

import LastModifiedBy from '@salesforce/schema/Org__c.LastModifiedById';


import { CloseActionScreenEvent } from 'lightning/actions';
export default class Updatebutton extends LightningElement {
    @api ticket ={};
    myFields = [TicketName ,Nticket,ref,Status ,Priority, Criticité,Type,project,reception,prisecharge,end,Affected_to,sendfrom,Suivipar,equipe,Client,module,parent,Contrat,demande,test,Description,resolution,Remark,commentaire,reproduction   ,LastModifiedBy,CreatedById];
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

                message: 'Ticket Record Updated!',

                variant: 'success'

            })

        );

   }

}
