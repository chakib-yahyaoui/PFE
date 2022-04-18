import { LightningElement,wire } from 'lwc';

import getDepartments from "@salesforce/apex/departmentListViewHelper.getDepartments"
import searchDepartments from "@salesforce/apex/departmentListViewHelper.searchDepartments"
import deleteDepartments from "@salesforce/apex/departmentListViewHelper.deleteDepartments"

import { NavigationMixin } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';

const actions = [{label: 'Delete', name: 'delete'},
{label: 'View', name: 'view'},
{label: 'Edit', name: 'edit'}]

const COLS = [{label: 'Name', fieldName: 'link', type: 'url', typeAttributes: {label: {fieldName: 'Name'}}},
            {label: 'Description', fieldName: 'Description'},
            { fieldName: "actions", type: 'action', typeAttributes: {rowActions: actions}}
]

export default class DepartmentListView extends  NavigationMixin (LightningElement) {
    cols = COLS ;
    departments;
    wiredDepartments;
    selectedDepartments;
    baseData;

    get selectedDepartmentsLen() {
        if(this.selectedDepartments == undefined) return 0;
        return this.selectedDepartments.length
    }

    @wire(getDepartments)
    departmentsWire(result){
        this.wiredDepartments = result;
        if(result.data){
            this.departments = result.data.map((row) => {
                return this.mapDepartments(row);
            })
            this.baseData = this.departments;
        }
        if(result.error){
            console.error(result.error);
        }
    }

    mapDepartments(row){
        


        return {...row,
            Name: `${row.Name}`,
            link: `/${row.Id}`,
            Description: `${row.Description__c}`
        };
    }

    handleRowSelection(event){
        this.selectedDepartments = event.detail.selectedRows;
    }

    async handleSearch(event){
        if(event.target.value == ""){
            this.departments = this.baseData
        }else if(event.target.value.length > 1){
            const searchDepartments = await searchDepartment({searchString: event.target.value})

            this.departments = searchDepartments.map(row => {
                return this.mapDepartments(row);
            })
        }
    }

    navigateToNewRecordPage() {

        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Department__c',
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
                        objectApiName: 'Department__c',
                        actionName: 'edit'
                    }
                });
                break;
            case 'delete' :
                deleteDepartments({departmentIds : [event.detail.row.Id]}).then(() => {
                    refreshApex(this.wiredDepartments);
                })
        }
    }

    deleteSelectedDepartments(){
        const idList = this.selectedDepartments.map( row => { return row.Id })
        deleteDepartments({departmentIds : idList}).then( () => {
            refreshApex(this.wiredDepartments);
        })
        this.template.querySelector('lightning-datatable').selectedRows = [];
        this.selectedDepartments = undefined;
    }
}