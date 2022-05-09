import { api, LightningElement, track, wire } from 'lwc';  
import fetchRecs from '@salesforce/apex/accountListViewHelper.fetchRecs';   
import { NavigationMixin } from 'lightning/navigation';
 
export default class AccountListView extends NavigationMixin(LightningElement) {
    listRecs;  
    initialListRecs;
    error;  
    columns;  
    items = []; 
    page = 1; 
    columns; 
    startingRecord = 1;
    endingRecord = 0; 
    pageSize = 10; 
    totalRecountCount = 0;
    totalPage = 0;
 
    @api Fields;
    @api TableColumns;
    @api Title;
    @api ObjectName;
    @api ObjectIcon = 'standard:account';
    @api RecordPage;
 
    sortedBy;
    defaultSortDirection = 'asc';
    sortDirection = 'asc';
 
    connectedCallback() {
        console.log( 'Columns are ' + this.TableColumns );
        this.columns = JSON.parse( this.TableColumns.replace( /([a-zA-Z0-9]+?):/g, '"$1":' ).replace( /'/g, '"' ) );
        console.log( 'Columns are ' + this.columns );
    }
 
    get vals() { 
        return this.ObjectName + '-' + this.Fields; 
    }
 
    @wire(fetchRecs, { listValues: '$vals' })  
    wiredRecs( { error, data } ) {
 
        if(data) {
            this.listRecs = data;
            let newData;   
            let objName = this.RecordPage;
            newData = JSON.parse(JSON.stringify(data));
            newData.forEach(function(entry) {  
                if (entry.CreatedBy){   
                    entry.CreatedByName = entry.CreatedBy.Name;   
                }
                if(entry.Id){
                    entry.recordLink = "/customers/s/" + objName + "?id=" + entry.Id;
                }  
            }); 
 
            let newRecords = [...newData];   
            this.items = newRecords; 
 
            this.initialListRecs = this.items;
 
            this.totalRecountCount = data.length; 
            this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize); 
            this.listRecs = this.items.slice(0,this.pageSize); 
            this.endingRecord = this.pageSize;
        } else if (error) {
            this.listRecs = null;
            this.initialListRecs = null;
            this.error = error;
            console.log(error);
        }
         
    }
    handleRefresh(event){
 
    }
 
 
    //this method displays records page by page
    displayRecordPerPage(page){
 
        this.startingRecord = ((page -1) * this.pageSize) ;
        this.endingRecord = (this.pageSize * page);
 
        this.endingRecord = (this.endingRecord > this.totalRecountCount) 
                            ? this.totalRecountCount : this.endingRecord; 
 
        this.listRecs = this.items.slice(this.startingRecord, this.endingRecord);
 
        this.startingRecord = this.startingRecord + 1;
    }    
 
 
    //clicking on previous button this method will be called
    previousHandler() {
        if (this.page > 1) {
            this.page = this.page - 1; //decrease page by 1
            this.displayRecordPerPage(this.page);
        }
    }
 
    //clicking on next button this method will be called
    nextHandler() {
        if((this.page<this.totalPage) && this.page !== this.totalPage){
            this.page = this.page + 1; //increase page by 1
            this.displayRecordPerPage(this.page);            
        }             
    }
 
    get showButtonPrevious(){
        return this.page == 1;
    }
 
    get showButtonNext(){
        return this.page === this.totalPage;
    }
  
    handleKeyChange(event) {  
           
        const searchKey = event.target.value.toLowerCase();  
        console.log( 'Search Key is ' + searchKey );
 
        if (searchKey) { 
            this.listRecs = this.initialListRecs;
 
             if (this.listRecs) {
                let recs = [];
                for ( let rec of this.listRecs ) {
 
                    console.log( 'Rec is ' + JSON.stringify( rec ) );
                    let valuesArray = Object.values( rec );
 
  
                    for ( let val of valuesArray ) {
                        if ( (typeof val) != 'object' && val.toLowerCase().includes(searchKey)) {
                            recs.push( rec );
                            break;
                        }
                    }
                }
 
                console.log( 'Recs are ' + JSON.stringify( recs ) );
                this.items = recs;
 
             }
  
        }else {
            this.items = this.initialListRecs;
        }
 
        this.page = 1; 
        this.startingRecord = 1;
        this.endingRecord = 0; 
        this.totalPage = 0;
 
        this.totalRecountCount = this.items.length; 
        this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize); 
        this.listRecs = this.items.slice(0,this.pageSize); 
        this.endingRecord = this.pageSize;
    }  
 
    onHandleSort( event ) {
         
        const { fieldName: sortedBy, sortDirection } = event.detail;
        const cloneData = [...this.items];
        cloneData.sort( this.sortBy( sortedBy, sortDirection === 'asc' ? 1 : -1 ) );
        this.items = cloneData;
        this.sortDirection = sortDirection;
        this.sortedBy = sortedBy;
 
        this.page = 1; 
        this.startingRecord = 1;
        this.endingRecord = 0; 
        this.totalPage = 0;
 
        this.totalRecountCount = this.items.length; 
        this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize); 
        this.listRecs = this.items.slice(0,this.pageSize); 
        this.endingRecord = this.pageSize;
    }
 
    sortBy( field, reverse, primer ) {
 
        const key = primer
            ? function( x ) {
                  return primer(x[field]);
              }
            : function( x ) {
                  return x[field];
              };
 
        return function( a, b ) {
            a = key(a);
            b = key(b);
            return reverse * ( ( a > b ) - ( b > a ) );
        };
 
    }
 
    handleRowAction( event ) {
 
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch ( actionName ) {
            case 'view':
                this[NavigationMixin.GenerateUrl]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: row.Id,
                        actionName: 'view',
                    },
                }).then(url => {
                     window.open(url);
                });
                break;
            case 'edit':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: row.Id,
                        objectApiName: this.RelatedObject,
                        actionName: 'edit'
                    }
                });
                break;
            default:
        }
 
    }
 
    createNew() {
 
        this[NavigationMixin.Navigate]({            
            type: 'standard__objectPage',
            attributes: {
                objectApiName: this.ObjectName,
                actionName: 'new'                
            }
        });
 
    }
}