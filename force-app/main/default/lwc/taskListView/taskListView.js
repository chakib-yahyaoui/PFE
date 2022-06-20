import { LightningElement, wire } from 'lwc';

import getTasks from "@salesforce/apex/TaskListView.getTasks"
import searchTask from "@salesforce/apex/TaskListView.searchTask"
import deleteTasks from "@salesforce/apex/TaskListView.deleteTasks"
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';

const ACTIONS = [{label: 'Delete', name: 'delete'},
{label: 'View', name: 'view'},
{label: 'Edit', name: 'edit'}]

const COLS = [{label: 'Task Name', fieldName: 'link', type: 'url', typeAttributes: {label: {fieldName: 'Name'}}},
            {label: 'Start Date', fieldName: 'Start_Date'},
            {label: "End Date", fieldName: 'Due_Date'},
            {label: "Task Status", fieldName: 'Status'},
            { fieldName: "actions", type: 'action', typeAttributes: {rowActions: ACTIONS}}
]


export default class TaskListView extends LightningElement {
    cols = COLS;
    tasks;
    wiredTasks;
    selectedTasks;
    baseData;
    taskList = [];

	
    refresh() {
        refreshApex(this.wiredTasks);
      }

	

    get selectedTasksLen() {
        if(this.selectedTasks == undefined) return 0;
        return this.selectedTasks.length
    }

    @wire(getTasks)
    tasksWire(result){
        this.wiredTasks = result;
        if(result.data){
            this.tasks = result.data.map((row) => {
                return this.mapTasks(row);
            })
            this.baseData = this.tasks;
        }
        if(result.error){
            console.error(result.error);
        }
    }

    mapTasks(row){
        
        return {...row,
            Name: `${row.Name}`,
            link: `/${row.Id}`,
            Start_Date: `${row.Start_Date__c}`,
            Due_Date: `${row.Due_Date__c}`,
            Status: `${row.Status__c}`,
            
            
        };
    }

    handleRowSelection(event){
        this.selectedTasks = event.detail.selectedRows;
    }

    async handleSearch(event){
        if(event.target.value == ""){
            this.tasks = this.baseData
        }else if(event.target.value.length > 1){
            const searchTasks = await searchTask({searchString: event.target.value})

            this.tasks = searchTasks.map(row => {
                return this.mapTasks(row);
            })
        }
    }
    

    navigateToNewRecordPage() {

        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'PMT_Task__c',
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
                        objectApiName: 'PMT_Task__c',
                        actionName: 'edit'
                    }
                });
                break;
            case 'delete' :
                deleteTasks({taskIds : [event.detail.row.Id]}).then(() => {
                    refreshApex(this.wiredTasks);
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

    deleteSelectedTasks(){
        const idList = this.selectedTasks.map( row => { return row.Id })
        deleteTasks({taskIds : idList}).then( () => {
            refreshApex(this.wiredTasks);
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
        this.selectedTasks = undefined;
        
    }
}