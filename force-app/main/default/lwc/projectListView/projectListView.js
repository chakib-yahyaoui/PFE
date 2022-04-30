import { LightningElement,wire } from 'lwc';

import getProjects from "@salesforce/apex/projectListViewHelper.getProjects"
import searchProject from "@salesforce/apex/projectListViewHelper.searchProject"
import deleteProjects from "@salesforce/apex/projectListViewHelper.deleteProjects"
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';

const actions = [{label: 'Delete', name: 'delete'},
{label: 'View', name: 'view'},
{label: 'Edit', name: 'edit'}]

const COLS = [{label: 'Project Name', fieldName: 'link', type: 'url', typeAttributes: {label: {fieldName: 'Name'}}},
            {label: 'Specifications', fieldName: 'Specification'},
            {label: 'Date begin', fieldName: 'Date_begin'},
            {label: 'Date end', fieldName: 'Date_end'},
            { fieldName: "actions", type: 'action', typeAttributes: {rowActions: actions}}
]

export default class ProjectListView extends  NavigationMixin (LightningElement) {
    cols = COLS ;
    projects;
    wiredProjects;
    selectedProjects;
    baseData;

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
            Specification: `${row.Specifications__c}`,
            Date_begin: `${row.Date_begin__c}`,
            Date_end: `${row.Date_end__c}`
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
    navigateToNewRecordPage() {

        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Project__c',
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
                        objectApiName: 'Project__c',
                        actionName: 'edit'
                    }
                });
                break;
            case 'delete' :
                deleteProjects({projectIds : [event.detail.row.Id]}).then(() => {
                    refreshApex(this.wiredProjects);
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

    deleteSelectedProjects(){
        const idList = this.selectedProjects.map( row => { return row.Id })
        deleteProjects({projectIds : idList}).then( () => {
            refreshApex(this.wiredProjects);
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
        this.selectedProjects = undefined;
    }
}