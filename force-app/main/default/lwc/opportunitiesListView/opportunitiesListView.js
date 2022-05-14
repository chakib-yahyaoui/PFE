import { LightningElement, wire } from 'lwc';

import getOpportunities from "@salesforce/apex/opportinitiesListViewHelper.getOpportunities"
import searchOpportunity from "@salesforce/apex/opportinitiesListViewHelper.searchOpportunity"
import deleteOpportunities from "@salesforce/apex/opportinitiesListViewHelper.deleteOpportunities"

import { NavigationMixin } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';

const ACTIONS = [{label: 'Delete', name: 'delete'}]

const COLS = [{label: 'Name', fieldName: 'link', type: 'url', typeAttributes: {label: {fieldName: 'Name'}}},
            {label: 'Amount', fieldName: 'Amount'},
            {label: 'Account', fieldName: "accountLink", type: 'url', typeAttributes: {label: {fieldName: 'AccountName'}}},
            {label: "Close Date", fieldName: 'CloseDate'},
            {label: "Stage Name", fieldName: 'StageName'},
            {label: "Type", fieldName: 'Type'},
            { fieldName: "actions", type: 'action', typeAttributes: {rowActions: ACTIONS}}
]

export default class OpportunitiesListView extends NavigationMixin(LightningElement) {
    cols = COLS;
    opportunities;
    wiredOpportunities;
    selectedOpportunities;
    baseData;

    get selectedOpportunitiesLen() {
        if(this.selectedOpportunities == undefined) return 0;
        return this.selectedOpportunities.length
    }

    @wire(getOpportunities)
    opportunitiesWire(result){
        this.wiredOpportunities = result;
        if(result.data){
            this.opportunities = result.data.map((row) => {
                return this.mapOpportunities(row);
            })
            this.baseData = this.opportunities;
        }
        if(result.error){
            console.error(result.error);
        }
    }

    mapOpportunities(row){
        var accountName = '';
        var accountLink = '';
        if(row.AccountId != undefined){
            accountLink = `/${row.AccountId}`;
            accountName = row.Account['Name'];
        }

        
        

        return {...row,
            Name: `${row.Name}`,
            link: `/${row.Id}`,
            accountLink: accountLink,
            AccountName: accountName,
            Amount: `${row.Amount}`,
            CloseDate: `${row.CloseDate}`,
            StageName: `${row.StageName}`,
            Type: `${row.Type}`,
            
        };
    }

    handleRowSelection(event){
        this.selectedOpportunities = event.detail.selectedRows;
    }

    async handleSearch(event){
        if(event.target.value == ""){
            this.opportunities = this.baseData
        }else if(event.target.value.length > 1){
            const searchOpportunities = await searchOpportunity({searchString: event.target.value})

            this.opportunities = searchOpportunities.map(row => {
                return this.mapOpportunities(row);
            })
        }
    }

    navigateToNewRecordPage() {

        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Opportunity',
                actionName: 'new'
            }
        });
    }

    handleRowAction(event) {
        deleteOpportunities({opportunityIds : [event.detail.row.Id]}).then(() => {
            refreshApex(this.wiredOpportunities);
        })
    }

    deleteSelectedOpportunities(){
        const idList = this.selectedOpportunities.map( row => { return row.Id })
        deleteOpportunities({opportunityIds : idList}).then( () => {
            refreshApex(this.wiredOpportunities);
        })
        this.template.querySelector('lightning-datatable').selectedRows = [];
        this.selectedOpportunities = undefined;
    }
}