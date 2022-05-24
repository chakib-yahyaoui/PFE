import { LightningElement, wire, api, track} from 'lwc';
import { refreshApex } from '@salesforce/apex';
import createDepartment from '@salesforce/apex/departmentListViewHelper.createDepartment';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import updateDepartment from '@salesforce/apex/departmentListViewHelper.updateDepartment';
import departmentObject from '@salesforce/schema/Department__c';
import getUserList from '@salesforce/apex/departmentListViewHelper.getUserList';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import getDepartments from "@salesforce/apex/departmentListViewHelper.getDepartments"
import searchDepartment from "@salesforce/apex/departmentListViewHelper.searchDepartment"
import deleteDepartments from "@salesforce/apex/departmentListViewHelper.deleteDepartments"
import getDepartment from '@salesforce/apex/departmentListViewHelper.getDepartment';



const actions = [{label: 'Delete', name: 'delete'},
{label: 'View', name: 'view'},
{label: 'Edit', name: 'edit'}]

const COLS = [{label: 'Department Name', fieldName: 'link', type: 'url', typeAttributes: {label: {fieldName: 'Name'}}},
            {label: 'Description', fieldName: 'Description'},
            {label: 'Date de création', fieldName: 'Date_de_création' },
            {label: 'Date de modification', fieldName: 'Date_de_modification'},
            { fieldName: "actions", type: 'action', typeAttributes: {rowActions: actions}}
]

export default class DepartmentListView extends  NavigationMixin (LightningElement) {
    cols = COLS ;
    departments;
    wiredDepartments;
    selectedDepartments;
    baseData;
    @track customFormModal = false; 
    @track departmentRecoredId;
    @wire(getUserList) User;
    @track wiredgetUser;
     @wire(getObjectInfo, { objectApiName: departmentObject })
     departmentInfo;
  
     
     @track isModalOpenEdit= false;
     @api objectApiName; 
     
     @track error; 
     @api NewDepartment ={};
     @api department ={};
     @api dep ={};
     
     @api departmentObject={};
  
   @track isModalOpen = false;
  openModal() {
     this.isModalOpen = true; 
  }
  closeModal() {
     this.isModalOpen = false;
  }
  handleNameChange(event) {
    this.departmentObject.Name = event.target.value;
  }
  
  handleDescriptionChange(event) {
    this.departmentObject.Description = event.target.value;
  }
  handleMemberChange(event) {
   this.departmentObject.Member = event.target.value;
  }
  handleManagerChange(event) {
   this.departmentObject.Manager = event.target.value;
  }
  handleProjectManagerChange(event) {
   this.departmentObject.Project_Manager = event.target.value;
  }
  submitDetails() {
     console.log('member',this.departmentObject.Member)
     console.log('manager',this.departmentObject.Manager)
     console.log('project manager',this.departmentObject.Project_Manager)
     createDepartment({ DepartmentRecObj: this.departmentObject })
              .then(result => {
                this.departmentRecoredId = result.Id;
                window.console.log('departmentRecoredId##Vijay2 ' + this.departmentRecoredId);  
                  console.log('success' + result);
                  this.isModalOpen = false;
                  this.departmentObject = {};
                  this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Department created successfully..!',
                        variant: 'success',
                    }),
                );
                refreshApex(this.wiredDepartments);
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: result.Id,
                        objectApiName: 'Department__c',
                        actionName: 'view'
                    },
                });
                  
  
               })
               
               
               
               .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
            });
        
              
          }
  
     
    
  
    @track departmentObjName;
    @track departmentObjDescription;
    
    @track departmentRecoredId;
    @track errorMsg;
 
   departmentHandleChange(event){
        if(event.target.name == 'departmentName'){
        this.departmentObjName = event.target.value;  
        //window.console.log('scoreObName ##' + this.scoreObName);
        }
      if(event.target.name == 'departmentDescription'){
        this.departmentObjDescription = event.target.value;  
      }
 
      
      
 
 
 }
 
 

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
            Description: `${row.Description__c}`,
            Date_de_création: `${row.Date_de_cr_ation__c}`,
            Date_de_modification: `${row.Date_de_modification__c}`,
            
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
                getDepartment({ DepartmentId: row.Id })
                  .then(result => {
               console.log('test', result[0])
                      this.department = result[0];
                      this.NewDepartment.Id = this.department.Id;
                      this.openModalEdit();
                      console.log('test1', result[0])
                });
                break;
            case 'delete' :
                deleteDepartments({departmentIds : [event.detail.row.Id]}).then(() => {
                    refreshApex(this.wiredDepartments);
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
    openModalEdit() {
        console.log('hi')
        this.isModalOpenEdit = true; 
    }
    closeModalEdit() {
        this.isModalOpenEdit = false;
    }
    handleNameEdit(event) {
      this.NewDepartment.Name = event.target.value;
    }
    
    
    handleDescriptionEdit(event) {
    this.NewDepartment.Description__c = event.target.value;
    }
    handleMemberEdit(event) {
    this.NewDepartment.Member__c = event.target.value;
    }
    handleManagerEdit(event) {
      this.NewDepartment.Manager__c = event.target.value;
      }
      handleProjectManagerEdit(event) {
        this.NewDepartment.Project_Managers__c = event.target.value;
        }
        
      submitDetailsEdit() {
     console.log('hi', this.NewDepartment.Member__c)
     console.log('hi', this.NewDepartment.Manager__c)
     console.log('hi', this.NewDepartment.Project_Managers__c)
        updateDepartment({ dep: this.NewDepartment })
            .then(result  => {
                this.departmentRecoredId = result.Id;
                window.console.log('departmentRecoredId##Vijay2 ' + this.departmentRecoredId);  
                console.log('success' + result);

                console.log('tested',this.department);
                this.NewDepartment = {}
                console.log('teste',this.NewDepartment);
                this.isModalOpenEdit = false;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Department updated successfully..!',
                        variant: 'success',
                    }),
                );
                refreshApex(this.wiredDepartments);
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: result.Id,
                        objectApiName: 'Department__c',
                        actionName: 'view'
                    },
                });
                
                
            });
    }

    deleteSelectedDepartments(){
        const idList = this.selectedDepartments.map( row => { return row.Id })
        deleteDepartments({departmentIds : idList}).then( () => {
            refreshApex(this.wiredDepartments);
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
        this.selectedDepartments = undefined;
    }
}