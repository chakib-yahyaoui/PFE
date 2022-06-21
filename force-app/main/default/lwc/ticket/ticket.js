import { LightningElement, wire, api, track} from 'lwc';
import { refreshApex } from '@salesforce/apex';
import createTicket from '@salesforce/apex/TicketController.createTicket';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import { deleteRecord } from 'lightning/uiRecordApi';
import getTicketsByName from '@salesforce/apex/TicketController.getTicketsByName';
import updateTicket from '@salesforce/apex/TicketController.updateTicket';
import getProjet from '@salesforce/apex/TicketController.getProjectList';
import ticketObject from '@salesforce/schema/Ticket__c';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import Status__c from '@salesforce/schema/Ticket__c.Status__c';
import getTicket from '@salesforce/apex/TicketController.getTicket';
import getUser from '@salesforce/apex/TicketController.getUserList';
import Type_de_la_demande__c from '@salesforce/schema/Ticket__c.Type_de_la_demande__c';
import Type__c from '@salesforce/schema/Ticket__c.Type__c';
import Priority__c from '@salesforce/schema/Ticket__c.Priority__c';
import getNumberTickets from "@salesforce/apex/TicketController.getNumberTickets";

import { getObjectInfo } from 'lightning/uiObjectInfoApi';
const DELAY = 300;
// ************************* ticket TABLE DECLERATIONS ************************************

const columns = [
    {
        label: 'Ticket Name',
        fieldName: 'Name',
        type:'text',
        sortable: true
      
    },
    
    {
        label: 'Type',
        fieldName: 'Type__c',
        type: 'picklist'
    },
    {
        label: 'Priority',
        fieldName: 'Priority__c',
        type: 'picklist'
        
    },
 
    { 
        label: 'Action',
    type: 'button',
    typeAttributes: { label: 'View details', name: 'view_details',value :'Ticket.Id'}},
    { type:'button-icon',initialWidth: 40,hideLabel:true,class:'delete',typeAttributes: {iconName:'action:delete',label:'delete',name:'delete',title:'delete',disabled:false,value:'delete'}},
    { type:'button-icon',initialWidth: 40,hideLabel:true,class:'edit',typeAttributes: {iconName:'action:edit',label:'edit',name:'edit',title:'edit',disabled:false,value:'edit'}},

];

let i=0;
export default class Ticket
 extends NavigationMixin(LightningElement) {
    @wire(getObjectInfo, { objectApiName: ticketObject })
    ticketInfo;
    @wire(getNumberTickets)
    number;
    navigateToNewRecordPage() {

        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Ticket__c',
                actionName: 'new'
            }
        });
    }
    @wire(getPicklistValues,
        {
            recordTypeId: '$ticketInfo.data.defaultRecordTypeId',
            fieldApiName: Type__c
        }
    )
    typeValues;
    
    @wire(getObjectInfo, { objectApiName: ticketObject })
    ticketInfo;
    @wire(getPicklistValues,
        {
            recordTypeId: '$ticketInfo.data.defaultRecordTypeId',
            fieldApiName: Status__c
        }
    )
    statutValues;

    @wire(getObjectInfo, { objectApiName: ticketObject })
    ticketInfo;
    @wire(getPicklistValues,
        {
            recordTypeId: '$ticketInfo.data.defaultRecordTypeId',
            fieldApiName: Priority__c
        }
    )
    priorityValues;
    @wire(getPicklistValues,
        {
            recordTypeId: '$ticketInfo.data.defaultRecordTypeId',
            fieldApiName: 	Type_de_la_demande__c
        }
    )
    demandeValues;
    @wire(getUser) User ;
    @wire(getProjet) projet ;
    @api objectApiName; 
    @track page = 1;
    @track error; 
    @track startingRecord = 1;
    @track endingRecord = 0; 
    @track pageSize = 15; 
    @track totalRecountCount = 0;
    @track items = []; 
    @api NewTicket ={};
    @api ticket ={};
    @track value;
    @track wiredDataResult;
    @api sortedDirection = 'asc';
    @api sortedBy ;
    @api searchKey = '';
    @api recordId;
    @track recordId ; 
    @track data;
    @track columns = columns;
    @track allticketsData;
    @track totalPage = 0;
    hello= true;
    result;
    loading;
    @track wiredgetProjet;
    defaultSortDirection = 'asc';
    @api TicketIdDet;
   
    refresh() {
        refreshApex(this.wiredDataResult);
      }
  connectedCallback() 
  {
    this.stopLoading(500);
  } 
  stopLoading(timeoutValue)
  {
    setTimeout(() => {
      refreshApex(this.wiredDataResult);
      
      this.loading = false;
    }, timeoutValue);
  } 
  
    @wire(getTicketsByName, {searchKey: '$searchKey'})
    getTicketsByName(result) {
        console.log('hi')
        this.loading = true;
        this.stopLoading(500);
        this.wiredDataResult = result;    
            console.log(result)

                if (result.data) 
                       {    this.allticketsData = result.data;
                        console.log(  this.allticketsData)
                            this.items = this.allticketsData ;
                            this.totalRecountCount = this.allticketsData.length; 
                            this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize); 
                            this.allticketsData = this.items.slice(0,this.pageSize); 
                            this.endingRecord = this.pageSize;
                            this.columns = columns;
                       }
                else if (result.error) {
                            this.error = result.error;
                            this.columns = undefined;
                       }
                       console.log(this.allticketsData)
                       }
        //clicking on previous button this method will be called
        previousHandler() {
            this.isPageChanged = true;
            if (this.page > 1) {
                this.page = this.page - 1; //decrease page by 1
                this.displayRecordPerPage(this.page);
            }
              var selectedIds = [];
              for(var i=0; i<this.allSelectedRows.length;i++){
                selectedIds.push(this.allSelectedRows[i].Id);
              }
            this.template.querySelector(
                '[data-id="table"]'
              ).selectedRows = selectedIds;
        }
        //clicking on next button this method will be called
        nextHandler() {
            this.isPageChanged = true;
            if((this.page<this.totalPage) && this.page !== this.totalPage){
                this.page = this.page + 1; //increase page by 1
                this.displayRecordPerPage(this.page);            
            }
              var selectedIds = [];
              for(var i=0; i<this.allSelectedRows.length;i++){
                selectedIds.push(this.allSelectedRows[i].Id);
              }
            this.template.querySelector(
                '[data-id="table"]'
              ).selectedRows = selectedIds;
        }
            //this method displays records page by page
    displayRecordPerPage(page){

        this.startingRecord = ((page -1) * this.pageSize) ;
        this.endingRecord = (this.pageSize * page);

        this.endingRecord = (this.endingRecord > this.totalRecountCount) 
                            ? this.totalRecountCount : this.endingRecord; 

        this.allticketsData = this.items.slice(this.startingRecord, this.endingRecord);
        this.startingRecord = this.startingRecord + 1;
    } 
    @track recordId ; 
    @track isModalOpen = false;
    @track isModalOpenEdit = false;
     // ************************* CLICKS ON ACTION ICONS ************************************
     handleclick(event){
        const row = event.detail.row ;
        const actionName = event.detail.action.name;  
        
        if ( actionName === 'view_details' ){
            this.TicketIdDet = event.target.value;
         console.log('hi')
            this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes: {
                    objectApiName: 'Ticket__c',
                    recordId: row.Id,
                    actionName: 'view'
                }
            });}
      else if ( actionName === 'delete') {
        const row = event.detail.row;
  
        deleteRecord(row.Id)
                  .then(() => {
                    this.loading = true;
                    this.stopLoading(500);
                    
                      this.dispatchEvent(
                          new ShowToastEvent({
                              title: 'Success',
                              message: 'Record deleted',
                              variant: 'success'
                          })
                      );
                  })
                  .catch(error => {
                      this.dispatchEvent(
                          new ShowToastEvent({
                              title: 'Error deleting record',
                              message: error.body.message,
                              variant: 'error'
                          })
                      );
                  });}
                  else if ( actionName === 'edit'){
                    getTicket({ TicketId: row.Id })
                    .then(result => {
                 console.log('test', result[0])
                        this.ticket = result[0];
                        console.log('he')
                        this.NewTicket.Id = this.ticket.Id;
                        console.log('hee', this.NewTicket.Id)
                        this.openModalEdit();
                        console.log('test1', result[0])
        
                    })
                    .catch(error => {
                        this.errormessage = error.message;
                    });}
                  
                   
                      }
  renderedCallback(){
           refreshApex(this.wiredDataResult);
      }
  
      
              
    
  
      handleKeyChange(event) {
        
        window.clearTimeout(this.delayTimeout);
        const searchKey = event.target.value;
        this.delayTimeout = setTimeout(() => {
            this.searchKey = searchKey;
        }, DELAY);
    } 
    // ************************* NOT FOUND ************************************


refrech() {
    this[NavigationMixin.Navigate]({
  
           type: 'standard__navItemPage',
           attributes: {
               apiName: 'ticket'
        },
    });
  }
  @api ticketObject={};

  @track isModalOpen = false;
  openModal() 
  {
    console.log('hi',this.items)
      this.isModalOpen = true;
      console.log('eho',this.ticketObject )

      console.log('hi1',this.projet.data)
      
  }
  closeModal() {
      this.isModalOpen = false;
  }
  openModalEdit() 
  {
    console.log('hi',this.items)
      this.isModalOpenEdit = true;
      console.log('hi1',this.projet.data)
     

      
  }
  closeModalEdit() {
      this.isModalOpenEdit = false;
  }
  submitDetails() {
     console.log('hiii' , this.ticket)
      createTicket({ TicketRecObj: this.ticketObject })
              .then(result => {
                  console.log('success' + result);
                  this.isModalOpen = false;
                  this.ticketObject = {};
  
               })
                .catch(error => {
                  this.error = error.message;
                  console.log("errooorrr", error);
                  this.errorAdd = true;

              });
          }
  
      handleNameChange(event) {
              this.ticketObject.Name = event.target.value;
          }
          
      handleNumChange(event) {
              this.ticketObject.NTicket = event.target.value;
          }
      handlepriorityChange(event) {
              this.ticketObject.priority = event.target.value;
          }
      handletypeChange(event) {
            this.ticketObject.Type= event.target.value;
        }
    
    handleprojectChange(event) {
          this.ticketObject.Project= event.target.value;
      }
      handleendChange(event){
        this.ticketObject.end= event.target.value;

      }
      handlebeginChange(event){
        this.ticketObject.begin= event.target.value;

      }
      handlestatutChange(event) {
        this.ticketObject.Statut = event.target.value;
    }
    handleprojectChange(event) {
        this.ticketObject.Project = event.target.value;
    }
    handlesendChange(event) {
        this.ticketObject.send = event.target.value;
    }
    handlesuiviChange(event) {
        this.ticketObject.suivi = event.target.value;
    }
    handletypeChange(event) {
        this.ticketObject.type = event.target.value;
    }
    handletransmisChange(event) {
        this.ticketObject.transmis = event.target.value;
    }
    handledemandeChange(event) {
        this.ticketObject.demande = event.target.value;
    }
    
    @track accid;

    setAccid(){
        this.accid = recordId;
    }
  
  /////////////////////
  


  
handleendEdit(event){
this.NewTicket.End_Date__c= event.target.value;

}
handlebeginEdit(event){
    this.NewTicket.Creation_Date__c= event.target.value;
    
    }
handlestatutEdit(event){
    this.NewTicket.Status__c= event.target.value;
    
    }
    handlepriorityEdit(event){
this.NewTicket.Priority__c= event.target.value;

}
handleProjectManagerEdit(event) {
    this.NewTicket.Project_Manager__c = event.target.value;
}

handlesendEdit(event) {
  this.NewTicket.Send_from__c = event.target.value;
}
handledemandeEdit(event) {
  this.NewTicket.Type_de_la_demande__c = event.target.value;
}
handletransmisEdit(event) {
this.NewTicket.transmis__c= event.target.value;
}
handleNameEdit(event) {
    this.NewTicket.Name= event.target.value;
    }
    handleNumEdit(event) {
        this.NewTicket.N_Ticket__c= event.target.value;
        }
        handletypeEdit(event) {
            this.NewTicket.Type__c= event.target.value;
            }

handleprojectEdit(event){
    this.NewTicket.Project__c= event.target.value;

}

  
  submitDetailsEdit() {
    console.log('hi', this.NewTicket)
    updateTicket({ ticket: this.NewTicket })
          .then(() => {
              console.log('tester');
              this.NewTicket = {}
              console.log('teste',this.NewTicket)
              this.isModalOpenEdit = false;
              refreshApex(this.wiredDataResult) });
          }
    sortBy(field, reverse, primer) {
        const key = primer
            ? function (x) {
                  return primer(x[field]);
              }
            : function (x) {
                  return x[field];
              };

        return function (a, b) {
            a = key(a);
            b = key(b);
            return reverse * ((a > b) - (b > a));
        };
    }

    onHandleSort(event) {
        const { fieldName: sortedBy, sortDirection } = event.detail;
        const cloneData = [...this.allticketsData];

        cloneData.sort(this.sortBy(sortedBy, sortDirection === 'asc' ? 1 : -1));
        this.allticketsData = cloneData;
        console.log('sort',this.allticketsData)
        this.sortDirection = sortDirection;
        this.sortedBy = sortedBy;
    }
    
    showDetails(event) {
    
            this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes: {
                    recordId: this.recordId,
                    objectApiName: 'Ticket__c',
                    actionName: 'view'
                }
            })
        }
           
           
    }