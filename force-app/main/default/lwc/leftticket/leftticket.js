
import chargeprevdev  from '@salesforce/schema/Ticket__c.Charge_pr_visonnelle_de_d_v__c';
import chargeprevsupp  from '@salesforce/schema/Ticket__c.Charge_pr_visonnelle_totale__c';
import chargerellsupp  from '@salesforce/schema/Ticket__c.Charge_r_elle_support__c';
import chargerelldev  from '@salesforce/schema/Ticket__c.Charge_r_elle_Dev__c';
import chargerelltot  from '@salesforce/schema/Ticket__c.Charge_r_elle_totale__c';
import commentaire  from '@salesforce/schema/Ticket__c.Commentaire__c';
import prisecharge  from '@salesforce/schema/Ticket__c.Date_et_heure_de_prise_en_charge__c';
import reception  from '@salesforce/schema/Ticket__c.Date_et_heure_de_r_ception__c';
import equipe  from '@salesforce/schema/Ticket__c.Equipe_de_traitement__c';
import module  from '@salesforce/schema/Ticket__c.Module_concern__c';
import Suivipar  from '@salesforce/schema/Ticket__c.Suivi_par__c';
import demande  from '@salesforce/schema/Ticket__c.Type_de_la_demande__c';
import transmis from '@salesforce/schema/Ticket__c.transmis__c';
import reproduction from '@salesforce/schema/Ticket__c.Etape_de_reproduction__c';

import resolution  from '@salesforce/schema/Ticket__c.Description_de_la_m_thode_de_r_solution__c';

import Type from '@salesforce/schema/Ticket__c.Type__c';
import Affected_to from '@salesforce/schema/Ticket__c.Attribue__c';
import Criticité from '@salesforce/schema/Ticket__c.Criticit__c';
import CreatedById from '@salesforce/schema/Org__c.CreatedById';
import chargeprevtot from '@salesforce/schema/Ticket__c.Charge_pr_visonnelle_totale__c';
import datedebint from '@salesforce/schema/Ticket__c.Date_debut_intervention__c';

import datefin from '@salesforce/schema/Ticket__c.Date_et_heure_de_r_ception__c';
import support from '@salesforce/schema/Ticket__c.Qualification_du_support__c';



import { LightningElement, api ,track} from 'lwc';
import { refreshApex } from '@salesforce/apex';
import LastModifiedBy from '@salesforce/schema/Org__c.LastModifiedById';
export default class Left extends LightningElement {
    @track wiredDataResult;
    @api objectApiName;
    caractérisation = [Criticité,module,demande,support ];
    prise=[reception,prisecharge]
    traitement=[datedebint,datefin];
    charge=[chargeprevsupp,chargerellsupp,chargeprevdev,chargerelldev,chargeprevtot,chargerelltot];
    attribution=[Suivipar,equipe,Affected_to];
    suivi=[reproduction,commentaire];
    system=[CreatedById,LastModifiedBy,Type, transmis];
    resolution=[resolution];
    @api ticket ={};
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
