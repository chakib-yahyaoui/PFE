import { LightningElement, wire } from 'lwc';

import getPMTprojects from "@salesforce/apex/PmtProjectListView.getPMTprojects"
import searchPMTproject from "@salesforce/apex/PmtProjectListView.searchPMTproject"
import deletePMTprojects from "@salesforce/apex/PmtProjectListView.deletePMTprojects"
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';

const ACTIONS = [{label: 'Delete', name: 'delete'},
{label: 'View', name: 'view'},
{label: 'Edit', name: 'edit'}]

const COLS = [{label: 'Project Name', fieldName: 'link', type: 'url', typeAttributes: {label: {fieldName: 'Name'}}},
            {label: 'Project Current Stage', fieldName: 'Project_Current_Stage'},
            {label: "Description", fieldName: 'Description'},
            {label: "Percentage Completion %", fieldName: 'Percentage_Completion'},
            {label: "Start Date", fieldName: 'Start_Date'},
            {label: "End Date", fieldName: 'End_Date'},
            { fieldName: "actions", type: 'action', typeAttributes: {rowActions: ACTIONS}}
]

export default class PMTprojectListView extends NavigationMixin(LightningElement) {
    cols = COLS;
    projects;
    wiredProjects;
    selectedProjects;
    baseData;
    projectList = [];

	
    refresh() {
        refreshApex(this.wiredProjects);
      }

	

    get selectedProjectsLen() {
        if(this.selectedProjects == undefined) return 0;
        return this.selectedProjects.length
    }

    @wire(getPMTprojects)
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
            Project_Current_Stage: `${row.inov8__Project_Status__c}`,
            Project_Health: `${row.inov8__Health_Icon__c}`,
            Description: `${row.inov8__Description__c}`,
            Percentage_Completion: `${row.inov8__Percentage_Completion__c}`,
            Start_Date: `${row.inov8__Kickoff_formula__c}`,
            End_Date: `${row.inov8__Deadline_formula__c}`,
            
        };
    }

    handleRowSelection(event){
        this.selectedProjects = event.detail.selectedRows;
    }

    async handleSearch(event){
        if(event.target.value == ""){
            this.projects = this.baseData
        }else if(event.target.value.length > 1){
            const searchProjects = await searchPMTproject({searchString: event.target.value})

            this.projects = searchProjects.map(row => {
                return this.mapProjects(row);
            })
        }
    }

    navigateToNewRecordPage() {

        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'inov8__PMT_Project__c',
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
                        objectApiName: 'inov8__PMT_Project__c',
                        actionName: 'edit'
                    }
                });
                break;
            case 'delete' :
                deletePMTprojects({projectIds : [event.detail.row.Id]}).then(() => {
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
        deletePMTprojects({projectIds : idList}).then( () => {
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