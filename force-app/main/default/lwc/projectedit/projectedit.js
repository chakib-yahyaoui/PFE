import { LightningElement, wire , track,api} from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

import getProjects from "@salesforce/apex/projectListViewHelper.getProjects";
import searchProject from "@salesforce/apex/projectListViewHelper.searchProject";
import deleteProjects from "@salesforce/apex/projectListViewHelper.deleteProjects";
import { refreshApex } from '@salesforce/apex';

const actions = [{label: 'Delete', name: 'delete'},
{label: 'View', name: 'view'},
{label: 'Edit', name: 'edit'}]

const COLS = [{label: 'Name', fieldName: 'link', type: 'url', typeAttributes: {label: {fieldName: 'Name'}}},
            {label: 'Specification', fieldName: 'Specification'},
            {label: 'Departement', fieldName: "accountLink", type: 'url', typeAttributes: {label: {fieldName: 'Departement'}}},
            {label: "Date Begin", fieldName: 'DateBegin'},
            {label: "Date End", fieldName: 'Date_End'},
            { fieldName: "actions", type: 'action', typeAttributes: {rowActions: actions}}
]

export default class ProjectListView extends NavigationMixin(LightningElement) {
    cols = COLS;
    projects;
    wiredProjects;
    selectedProjects;
    baseData;
    @track projectId;    
    get selectedProjectsLen() {
        if(this.selectedProjects == undefined) return 0;
        return this.selectedProjects.length
    }

    @wire(getProjects)
    projectsWire(result){
        this.wiredProjects = result;
        if(result.data){
            this.projects = result.data.map((row) => {
                return this.mapProjects(row);
            })
            this.baseData = this.projects;
        }
        if(result.error){
            console.error(result.error);
        }
    }

    mapProjects(row){
        


        return {...row,
            Name: `${row.Name}`,
            link: `/${row.Id}`,
            Specification: `${row.Specification__c}`,
            Departement: `${row.Departement__c}`,
            Date_Begin: `${row.Date_begin__c}`,
            Date_End: `${row.Date_end__c}`, 
        };
    }

    handleRowSelection(event){
        this.selectedProjects = event.detail.selectedRows;
    }

    async handleSearch(event){
        if(event.target.value == ""){
            this.projects = this.baseData
        }else if(event.target.value.length > 1){
            const searchProjects = await searchProject({searchString: event.target.value})

            this.projects = searchProjects.map(row => {
                return this.mapProjects(row);
            })
        }
    }

    handleShowModal() {
        const modal = this.template.querySelector("c-modal-Popup");
        modal.show();
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
                        objectApiName: 'Project__c',
                        actionName: 'edit'
                    }
                });
                break;
            case 'delete' :
                deleteProjects({projectIds : [event.detail.row.Id]}).then(() => {
                    refreshApex(this.wiredProjects);
                })
        }
    }

    deleteSelectedProjects(){
        const idList = this.selectedProjects.map( row => { return row.Id })
        deleteProjects({projectIds : idList}).then( () => {
            refreshApex(this.wiredProjects);
        })
        this.template.querySelector('lightning-datatable').selectedRows = [];
        this.selectedProjects = undefined;
    }
}