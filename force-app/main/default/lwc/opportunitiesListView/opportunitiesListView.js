import { LightningElement, wire } from 'lwc';

import getOpportunities from "@salesforce/apex/opportinitiesListViewHelper.getOpportunities"
import searchOpportunity from "@salesforce/apex/opportinitiesListViewHelper.searchOpportunity"
import deleteOpportunities from "@salesforce/apex/opportinitiesListViewHelper.deleteOpportunities"
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';
import {loadScript} from "lightning/platformResourceLoader";
import JSPDF from '@salesforce/resourceUrl/jspdf';
import getopportunities from '@salesforce/apex/PdfGenerator.getOpportunitiesController';

const ACTIONS = [{label: 'Delete', name: 'delete'},
{label: 'View', name: 'view'},
{label: 'Edit', name: 'edit'}]

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
    opportunityList = [];
	headers = this.createHeaders([
		"Id",
		"Name",
		"CloseDate",
        
	]);

	renderedCallback() {
        console.log("HEEEHI",this);
		Promise.all([
			loadScript(this, JSPDF)
		]);
	}

	generatePdf(){
		const { jsPDF } = window.jspdf;
		const doc = new jsPDF();

		doc.text("Hi I'm Souha", 20, 20);
        console.log("hi");
        console.log(doc.text);
		doc.table(30, 30, this.opportunitytList, this.headers, { autosize:true });
        console.log("hiiii");
		doc.save("demo.pdf");
	}

	generateData(){
        console.log('helooo');
		getopportunities().then(result=>{
            console.log('result', result);
			this.opportunityList = result;
            console.log('list', this.opportunityList);
			this.generatePdf();
		});
	}

	createHeaders(keys) {
		let result = [];
		for (let i = 0; i < keys.length; i += 1) {
			result.push({
				id: keys[i],
				name: keys[i],
				prompt : keys[i],
				width: 65,
				align: "center",
				padding: 0
			});
		}
		return result;
	}

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
                        objectApiName: 'opportunity',
                        actionName: 'edit'
                    }
                });
                break;
            case 'delete' :
                deleteOpportunities({opportunityIds : [event.detail.row.Id]}).then(() => {
                    refreshApex(this.wiredOpportunities);
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

    deleteSelectedOpportunities(){
        const idList = this.selectedOpportunities.map( row => { return row.Id })
        deleteOpportunities({opportunityIds : idList}).then( () => {
            refreshApex(this.wiredOpportunities);
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
        this.selectedContacts = undefined;
        
    }
}