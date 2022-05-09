import { LightningElement, track } from 'lwc';
import retrieveAccounts from '@salesforce/apex/SearchRecordsController.getAccounts';
import getUIThemeDescription from '@salesforce/apex/SearchRecordsController.getUIThemeDescription';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
 
 
const columns = [
                    {label: 'Name', fieldName: 'Name', type: 'text', sortable : true , wrapText: true},
                    {label: 'Account ID', fieldName: 'AccountNumber', type: 'text',sortable : true , wrapText: true},
                    {label: 'Phone', fieldName: 'Phone', type: 'phone', sortable : true , wrapText: true},
                    {label: 'Owner', fieldName: 'linkName', type: 'url', sortable : true, wrapText: true, 
                    typeAttributes: {label: { fieldName: 'OwnerName' }, target: '_blank' }},
                    {label: 'State', fieldName: 'BillingState', type: 'text', sortable : true , wrapText: true},
                    {label: 'Address', fieldName: 'BillingAddress', type: 'text', sortable : true , wrapText: true}
                ];
 
const columnsMobile = [
                            {label: 'Name', fieldName: 'Name', type: 'text',sortable : true , wrapText: true},
                            {label: 'Owner', fieldName: 'linkName', type: 'url',sortable : true, wrapText: true, 
                            typeAttributes: {label: { fieldName: 'OwnerName' }, target: '_blank' }},
                            {label: 'Details', type: 'button', initialWidth: 105, typeAttributes: { label:'Details', name:'view', title: 'Click to View Details'}},
                        ];
 
let i=0;
export default class SearchRecordLWC extends LightningElement {
    @track page = 1; //initialize 1st page
    @track items = []; //contains all the records.
    @track data; //data  displayed in the table
    @track columns = columns; //holds column info.
    @track startingRecord = 1; //start record position per page
    @track endingRecord = 0; //end record position per page
    @track pageSize = 15; //default value we are assigning
    @track totalRecountCount = 0; //total record count received from all retrieved records
    @track totalPage = 0; //total number of page is needed to display all records
    @track searchText = '';
    @track searchType = '';
    @track isLoading = false;
    @track sortDirection = 'asc';
    @track isDesktop;
    @track isMobile;
    @track showModal = false;
    @track modalFieldInfo;
    @track sortedBy;
    @track mydata;
    @track currentPageSize = 0;
 
 
    get searchOptions() {
        return [
            { label: 'Select Search Type', value: '' },
            { label: 'Account Name', value: 'Name' },
            { label: 'Account Phone', value: 'Phone' },
            { label: 'Account Number', value: 'Number' }
        ];
    }
 
    connectedCallback() {
        //get UI Info
        this.getUIInfo();
    }
 
    getUIInfo(){
        getUIThemeDescription({})
        .then(result=>{
            if(result == 'Theme4d'){
                this.isDesktop = true;
                this.isMobile = false;
                this.columns = columns;
            } else if(result == 'Theme4t'){
                this.isDesktop = false;
                this.isMobile = true;
                this.columns = columnsMobile;
            }
        }).catch(error=>{
                console.log(error);
        });
    }
 
    //check field validation
    handleCheckValidation() {
        let isValid = true;
        let inputFields = this.template.querySelectorAll('.fieldvalidate');
        inputFields.forEach(inputField => {
            if(!inputField.checkValidity()) {
                inputField.reportValidity();
                isValid = false;
            }
        });
        return isValid;
    }
 
    searchAccount(){
        if(this.handleCheckValidation()) {
            if(this.searchText == ''){
                this.page = 1;
                this.sortDirection = 'asc';
                this.sortBy = '';
                this.data = [];
                this.totalPage = 1;
                this.totalRecountCount = 0;
                return false;
            }
            this.isLoading = true;
            retrieveAccounts({searchText : this.searchText, searchType : this.searchType})
            .then(data=>{
                console.log(data);
                this.mydata = this.items = data.lstAccounts;
 
                var parseData = data.lstAccounts;
                parseData.forEach(record=>{
                    record.linkName = '/'+record.OwnerId;
                });
                this.items = parseData;
 
                this.page = 1;
                this.sortDirection = 'asc';
                this.sortBy = '';
                this.totalRecountCount = data.lstAccounts.length;
                this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize);
                //here we slice the data according page size
                this.data = this.items.slice(0, this.pageSize); 
                this.endingRecord = this.data.length;
                this.error = undefined;
                this.isLoading = false;
                this.currentPageSize = this.endingRecord - this.startingRecord + 1;
            }) .catch(error=>{
                console.log(error);
                this.error = error;
                this.data = undefined;
                this.isLoading = false;
                this.showToast(this.error, 'Error', 'Error'); //show toast for error
            })
        }
    }
 
    handleSearchTypeChange(event){
        this.searchType = event.detail.value;
    }
 
    handleChange(event){
        if(event.target.name == 'SearchText'){
            this.searchText = event.target.value;
        }else{
            this.searchText = event.target.value;
            this.searchType = event.target.name;
        }
    }
 
    closeModal(){
        this.showModal = false;
    }
 
    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        if(actionName == 'view'){
            this.showModal = true;
            this.modalFieldInfo = row;
        }
    }
 
    get isNameDisabled(){
        return (this.searchType !== 'Name' && this.searchText != '' ? true : false);
    }
 
    get isPhoneDisabled(){
        return (this.searchType !== 'Phone' && this.searchText != '' ? true : false);
    }
 
    get isNumberDisabled(){
        return (this.searchType !== 'Number' && this.searchText != '' ? true : false);
    }
 
    get isSearchTextDisabled(){
        return this.searchType == '' ? true : false;
    }
 
    //press on previous button this method will be called
    previousHandler() {
        if (this.page > 1) {
            this.page = this.page - 1;
            this.displayRecordPerPage(this.page);
        }
    }
 
    //press on next button this method will be called
    nextHandler() {
        if((this.page<this.totalPage) && this.page !== this.totalPage){
            this.page = this.page + 1;
            this.displayRecordPerPage(this.page);            
        }             
    }
 
    get isPreviousDisable(){
        return (this.page == 1 ? true : false);
    }
 
    get isNextDisable(){
        return (this.page === this.totalPage || (this.page > this.totalPage)) ? true : false;
    }
 
    //this method displays records page by page
    displayRecordPerPage(page){
         
        this.startingRecord = ((page -1) * this.pageSize) ;
        this.endingRecord = (this.pageSize * page);
 
        this.endingRecord = (this.endingRecord > this.totalRecountCount) 
                            ? this.totalRecountCount : this.endingRecord; 
 
        this.data = this.items.slice(this.startingRecord, this.endingRecord);
 
        //increment by 1 to display the startingRecord count, 
        //so for 2nd page, it will show "Displaying 6 to 10 of 23 records. Page 2 of 5"
        this.startingRecord = this.startingRecord + 1;
 
        //console.log(this.startingRecord);
        //console.log(this.endingRecord);
        this.currentPageSize = this.endingRecord - this.startingRecord + 1;
    }    
 
    showToast(message, variant, title) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
    }
 
    onHandleSort(event) {
        this.sortedBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        this.sortData(this.sortedBy, this.sortDirection);
    }
 
    sortData(fieldname, direction) {
        if (fieldname == 'linkName') {
            fieldname = 'OwnerName';
        }
        let parseData = [...this.items];
        // Return the value stored in the field
        let keyValue = (a) => {
            return a[fieldname];
        };
 
        console.log(keyValue);
        // cheking reverse direction
        let isReverse = direction === 'asc' ? 1: -1;
        // sorting data
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; // handling null values
            y = keyValue(y) ? keyValue(y) : '';
            // sorting values based on direction
            return isReverse * ((x > y) - (y > x));
        });
         
        parseData.forEach(record=>{
            record.linkName = '/'+record.OwnerId;
        });
        this.items = parseData;
        this.displayRecordPerPage(this.page);
    }
}