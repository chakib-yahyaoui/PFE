import { LightningElement, wire } from 'lwc';

import getAccounts from "@salesforce/apex/accountListView.getAccounts"
import searchAccount from "@salesforce/apex/accountListView.searchAccount"
import deleteAccounts from "@salesforce/apex/accountListView.deleteAccounts"
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';

const ACTIONS = [{label: 'Delete', name: 'delete'},
{label: 'View', name: 'view'},
{label: 'Edit', name: 'edit'}]

const COLS = [{label: 'Name', fieldName: 'link', type: 'url', typeAttributes: {label: {fieldName: 'Name'}}},
            {label: 'Site', fieldName: "link", type: 'url', typeAttributes: {label: {fieldName: 'Site'}}},
            {label: 'Phone', fieldName: "link", type: 'url', typeAttributes: {label: {fieldName: 'Phone'}}},
            { fieldName: "actions", type: 'action', typeAttributes: {rowActions: ACTIONS}}
]

export default class AccountListView extends LightningElement {
    cols = COLS;
    accounts;
    wiredAccounts;
    selectedAccounts;
    baseData;
    accountList = [];

	
    refresh() {
        refreshApex(this.wiredAccounts);
      }

	

    get selectedAccountsLen() {
        if(this.selectedAccounts == undefined) return 0;
        return this.selectedAccounts.length
    }

    @wire(getAccounts)
    wiredAccounts(result){
        this.wiredAccounts = result;
        if(result.data){
            this.accounts = result.data.map((row) => {
                return this.mapAccounts(row);
            })
            this.baseData = this.accounts;
        }
        if(result.error){
            console.error(result.error);
        }
    }

    mapAccounts(row){

        
        

        return {...row,
            Name: `${row.Name}`,
            link: `/${row.Id}`,
            Site: `${row.Site}`,
            link: `/${row.Id}`,
            Phone: `${row.Phone}`,
            link: `/${row.Id}`,
            
            
        };
    }

    handleRowSelection(event){
        this.selectedAccounts = event.detail.selectedRows;
    }

    async handleSearch(event){
        if(event.target.value == ""){
            this.accounts = this.baseData
        }else if(event.target.value.length > 1){
            const searchAccounts = await searchAccount({searchString: event.target.value})

            this.accounts = searchAccounts.map(row => {
                return this.mapAccounts(row);
            })
        }
    }

    navigateToNewRecordPage() {

        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName:'account',
                actionName: 'new'
            }
        });
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        this.recordId =  row.Id;
        switch(actionName){
            case 'view':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes:{
                        recordId: row.Id,
                        actionName: 'view'
                    }
                });
                break;
            case 'edit':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes:{
                        recordId: row.Id,
                        objectApiName: 'account',
                        actionName: 'edit'
                    }
                });
                break;
            case 'delete' :
                deleteAccounts({accountIds : [event.detail.row.Id]}).then(() => {
                    refreshApex(this.wiredAccounts);
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
                });
        }
    }

    deleteSelectedAccounts(){
        const idList = this.selectedAccounts.map( row => { return row.Id })
        deleteAccounts({accountIds : idList}).then( () => {
            refreshApex(this.wiredAccounts);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Records deleted',
                    variant: 'success'
                })
                
            );
            
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error deleting records',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });
        this.template.querySelector('lightning-datatable').selectedRows = [];
        this.selectedAccounts = undefined;
        
    }
}