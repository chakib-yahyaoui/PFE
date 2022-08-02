import { LightningElement, wire, api, track} from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import getWebServiceByName from '@salesforce/apex/WebServiceCntrl.getWebServiceByName';
import webServiceObject from '@salesforce/schema/WebService_Log__c';
import getWebService from '@salesforce/apex/WebServiceCntrl.getWebService';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
const DELAY = 300;
// ************************* web Service TABLE DECLERATIONS ************************************

const columns = [
    {
        label: 'Web Service Name',
        fieldName: 'Name',
        type:'text',
        sortable: true
      
    },
    
    {
        label: 'Web Service',
        fieldName: 'WebService__c',
        type: 'text'
    },
    {
        label: 'Event Date',
        fieldName: 'EventDate__c',
        type: 'datetime'
        
    },
    {
        label: 'Error',
        fieldName: 'Error__c',
        type: 'text'
        
    },
 

];

let i=0;

export default class WebService extends NavigationMixin(LightningElement) {

    @wire(getObjectInfo, { objectApiName: webServiceObject })
    webServiceInfo;
    @api objectApiName; 
    @track page = 1;
    @track error; 
    @track startingRecord = 1;
    @track endingRecord = 0; 
    @track pageSize = 15; 
    @track totalRecountCount = 0;
    @track items = []; 
    
    @track value;
    @track wiredDataResult;
    @api sortedDirection = 'asc';
    @api sortedBy ;
    @api searchKey = '';
    @api recordId;
    @track recordId ; 
    @track data;
    @track columns = columns;
    @track allwebServiceData;
    @track totalPage = 0;
    hello= true;
    result;
    loading;
    defaultSortDirection = 'asc';
    @api WebServiceIdDet;
   
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
  
    @wire(getWebServiceByName, {searchKey: '$searchKey'})
    getWebServiceByName(result) {
        console.log('hi')
        this.loading = true;
        this.stopLoading(500);
        this.wiredDataResult = result;    
            console.log(result)

                if (result.data) 
                       {    this.allwebServiceData = result.data;
                        console.log(  this.allwebServiceData)
                            this.items = this.allwebServiceData ;
                            this.totalRecountCount = this.allwebServiceData.length; 
                            this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize); 
                            this.allwebServiceData = this.items.slice(0,this.pageSize); 
                            this.endingRecord = this.pageSize;
                            this.columns = columns;
                       }
                else if (result.error) {
                            this.error = result.error;
                            this.columns = undefined;
                       }
                       console.log(this.allwebServiceData)
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

        this.allwebServiceData = this.items.slice(this.startingRecord, this.endingRecord);
        this.startingRecord = this.startingRecord + 1;
    } 
   

     // ************************* CLICKS ON ACTION ICONS ************************************

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
  @api webServiceObject={};

  @track isModalOpen = false;
  openModal() 
  {
    console.log('hi',this.items)
      this.isModalOpen = true;
      console.log('eho',this.webServiceObject )

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
  
     
  
  /////////////////////
  


  







  
  
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
        const cloneData = [...this.allwebServiceData];

        cloneData.sort(this.sortBy(sortedBy, sortDirection === 'asc' ? 1 : -1));
        this.allwebServiceData = cloneData;
        console.log('sort',this.allwebServiceData)
        this.sortDirection = sortDirection;
        this.sortedBy = sortedBy;
    }
    
    
}