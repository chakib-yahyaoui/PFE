import { LightningElement, wire, api, track} from 'lwc';
import { refreshApex } from '@salesforce/apex';
import createOrg from '@salesforce/apex/orgController.createOrg';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import { deleteRecord } from 'lightning/uiRecordApi';
import getOrgsByName from '@salesforce/apex/orgController.getOrgsByName';
import updateOrg from '@salesforce/apex/orgController.updateOrg';
import getOrg from '@salesforce/apex/orgController.getOrg';
import orgObject from '@salesforce/schema/Org__c';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import Type__c from '@salesforce/schema/Org__c.Type__c';
import getUserList from '@salesforce/apex/orgController.getUserList';
import getprojetList from '@salesforce/apex/orgController.getprojetList';
import getNumberOrg from '@salesforce/apex/orgController.getNumberOrg';

import { getObjectInfo } from 'lightning/uiObjectInfoApi';
const DELAY = 300;
// ************************* Org TABLE DECLERATIONS ************************************

const columns = [
    {
        label: 'Org Name',
        fieldName: 'Name',
        type:'text',
        sortable: true
      
    },
    {
        label: 'Login',
        fieldName: 'Login__c',
        type:'text',
        sortable: true
      
    },
    {
        label: 'Type',
        fieldName: 'Type__c',
        type: 'picklist'
       
    },
    {
        label: 'Password',
        fieldName: 'Password__c',
        type: 'text'
       
    },
 
    { 
label: 'Action',
    type: 'button',
    typeAttributes: { label: 'Voir details', name: 'view_details',value :'Org.Id'}},

    { type:'button-icon',initialWidth: 10,hideLabel:true,class:'delete',typeAttributes: {iconName:'action:delete',label:'delete',name:'delete',title:'delete',disabled:false,value:'delete'}},
    { type:'button-icon',initialWidth: 50,hideLabel:true,class:'edit',typeAttributes: {iconName:'action:edit',label:'edit',name:'edit',title:'edit',disabled:false,value:'edit'}},

];

export default class Organisation extends NavigationMixin(LightningElement) { 
   @wire(getUserList) User;
   @wire(getprojetList) projet;
   @track wiredgetUser;
    @wire(getObjectInfo, { objectApiName: orgObject })
    orgInfo;
    @wire(getNumberOrg)
    number;
    navigateToNewRecordPage() {

        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Org__c',
                actionName: 'new'
            }
        });
    }
    @wire(getPicklistValues,
        {
            recordTypeId: '$orgInfo.data.defaultRecordTypeId',
            fieldApiName: Type__c
        }
    )
    typeValues;
    @track isModalOpenEdit= false;
    @api objectApiName; 
    @track page = 1;
    @track error; 
    @track startingRecord = 1;
    @track endingRecord = 0; 
    @track pageSize = 15; 
    @track totalRecountCount = 0;
    @track items = []; 
    @api NewOrg ={};
    @api org ={};
    @track value;
    @track wiredDataResult;
    @api sortedDirection = 'asc';
    @api sortedBy ;
    @api searchKey = '';
    @api recordId;
    @track recordId ; 
    @track data;
    @track columns = columns;
    @track allorgsData;
    @track totalPage = 0;
    hello= true;
    result;
    loading;
    defaultSortDirection = 'asc';
    @api OrgIdDet;
    
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
  
    @wire(getOrgsByName, {searchKey: '$searchKey'})
    getOrgsByName(result) {
        console.log('hi')
        this.loading = true;
        this.stopLoading(500);
        this.wiredDataResult = result;    
            console.log(result)

                if (result.data) 
                       {    this.allorgsData = result.data;
                        console.log(  this.allorgsData)
                            this.items = this.allorgsData ;
                            this.totalRecountCount = this.allorgsData.length; 
                            this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize); 
                            this.allorgsData = this.items.slice(0,this.pageSize); 
                            this.endingRecord = this.pageSize;
                            this.columns = columns;
                       }
                else if (result.error) {
                            this.error = result.error;
                            this.columns = undefined;
                       }
                       console.log(this.allorgsData)
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

        this.allorgsData = this.items.slice(this.startingRecord, this.endingRecord);
        this.startingRecord = this.startingRecord + 1;
    } 
    @track recordId ; 
    @track isModalOpen = false;
     // ************************* CLICKS ON ACTION ICONS ************************************
     handleclick(event){
        const row = event.detail.row ;
        const actionName = event.detail.action.name;  
        
        if ( actionName === 'view_details' ){
            this.OrgIdDet = event.target.value;
         console.log('hi')
            this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes: {
                    objectApiName: 'Org__c',
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
                  getOrg({ OrgId: row.Id })
                  .then(result => {
               console.log('test', result[0])
                      this.org = result[0];
                      console.log('he')
                      this.NewOrg.Id = this.org.Id;
                      console.log('hee', this.NewOrg.Id)
                      this.openModalEdit();
                      console.log('test1', result[0])
      
                  })
                  .catch(error => {
                      this.errormessage = error.message;
                  });}}
          
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
               apiName: 'org'
        },
    });
  }
  @api orgObject={};

  @track isModalOpen = false;
openModal() {
    console.log('hi')
    this.isModalOpen = true; 
}
closeModal() {
    this.isModalOpen = false;
}
submitDetails() {
    console.log('hiii',this.orgObject.Prop)
     createOrg({ OrgRecObj: this.orgObject })
             .then(result => {
                 console.log('success' + result);
                 this.isModalOpen = false;
                 this.orgObject = {};
                 this.dispatchEvent(
                     new ShowToastEvent({
                         title: 'Success',
                         message: 'Un nouveau enregistrement a été créer avec succès!',
                         variant: 'success'
                     }));
                     console.log('success' + result);
                   
                 
              })
              .catch(error => {
                this.dispatchEvent(
                  new ShowToastEvent({
                      title: 'On n"a pas pu créer cet enregistrement , veuillez complèter les champs obligatoires !',
                      message: error.body.message,
                      variant: 'error'
                  })
              );

             });
         }
    handleNameChange(event) {
            this.orgObject.Name = event.target.value;
        }
        handleprojetChange(event) {
            this.orgObject.projet = event.target.value;
        }
    
    handletypeChange(event) {
            this.orgObject.type = event.target.value;
        }
    handleLoginChange(event) {
            this.orgObject.Login = event.target.value;
        }
        handlepropChange(event) {
            this.orgObject.Prop = event.target.value;
        }
        handlepasswordChange(event) {
            this.orgObject.password = event.target.value;
        } handlemanagerChange(event) {
            this.orgObject.backup = event.target.value;
        } handlesecretChange(event) {
            this.orgObject.SecretWord = event.target.value;
        } handlecontactChange(event) {
            this.orgObject.SSOcont = event.target.value;
        }
        handleServerChange(event) {
            this.orgObject.SSOServer = event.target.value;
        } handledomainChange(event) {
            this.orgObject.domain = event.target.value;
        }
        handleemailChange(event) {
            this.orgObject.Email = event.target.value;
        }
  ///sort 
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
        const cloneData = [...this.allorgsData];

        cloneData.sort(this.sortBy(sortedBy, sortDirection === 'asc' ? 1 : -1));
        this.allorgsData = cloneData;
        console.log('sort',this.allorgsData)
        this.sortDirection = sortDirection;
        this.sortedBy = sortedBy;
    }
    
    showDetails(event) {
    
            this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes: {
                    recordId: this.recordId,
                    objectApiName: 'Org__c',
                    actionName: 'view'
                }
            })
        }
      //////////////////////Edit////////////
handleNameEdit(event) {
        this.NewOrg.Name = event.target.value;
  }
    
  handleprojetEdit(event) {
    this.NewOrg.Project__c = event.target.value;
}
  handleLoginEdit(event) {
      this.NewOrg.Login__c = event.target.value;
  }
  handletypeEdit(event) {
    this.NewOrg.Type__c = event.target.value;
}
handlepropEdit(event) {
    this.NewOrg.Propritaire__c= event.target.value;
}
handlepasswordEdit(event) {
    this.NewOrg.Password__c= event.target.value;
}
handlemanagerEdit(event) {
    this.NewOrg.Backup_Manager__c= event.target.value;
}
handlesecretEdit(event) {
    this.NewOrg.Secret_Word__c= event.target.value;
}
handlecontactEdit(event) {
    this.NewOrg.SSO_Contact__c= event.target.value;
}
handleServerEdit(event) {
    this.NewOrg.SSO_Server__c= event.target.value;
}
handledomainEdit(event) {
    this.NewOrg.Noms_de_domaine__c= event.target.value;
}
handleemailEdit(event) {
    this.NewOrg.Email_a_prevenir__c= event.target.value;
}

openModalEdit() {
    console.log('hiiu')
    this.isModalOpenEdit = true; 
}
closeModalEdit() {
    this.isModalOpenEdit = false;
}
  submitDetailsEdit() {
 console.log('hi', this.NewOrg.Propritaire__c)
    updateOrg({ org: this.NewOrg })
        .then(() => {
            console.log('tested',this.org);
            this.NewOrg = {}
            console.log('teste',this.NewOrg);
            this.isModalOpenEdit = false;
            refreshApex(this.wiredDataResult)
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Cet enregistrement a été mis à jour avec succés!',
                    variant: 'success'
                }));})
              .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'On n"a pas pu mettre à jour cet enregistrement , veuillez complèter les champs obligatoires !',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            }); 
}}