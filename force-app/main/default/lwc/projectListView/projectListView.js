import { LightningElement,wire ,track,api} from 'lwc';

import getProjects from "@salesforce/apex/projectListViewHelper.getProjects"
import searchProject from "@salesforce/apex/projectListViewHelper.searchProject"
import deleteProjects from "@salesforce/apex/projectListViewHelper.deleteProjects"
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';
import updateProject from '@salesforce/apex/projectListViewHelper.updateProject';
import createProject from '@salesforce/apex/projectListViewHelper.createProject';
import projectObject from '@salesforce/schema/Project__c';
import getUserList from '@salesforce/apex/projectListViewHelper.getUserList';
import getDepartmentList from '@salesforce/apex/projectListViewHelper.getDepartmentList';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import getProject from '@salesforce/apex/projectListViewHelper.getProject';
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
    @track customFormModal = false; 
    @track projectRecoredId;
    @wire(getUserList) User;
    @track isModalOpenEdit= false;
    @track wiredgetUser;
    @wire(getDepartmentList) Department;
    @track wiredgetDepartment;
     @wire(getObjectInfo, { objectApiName: projectObject })
     projectInfo;
  
     
     @track isModalOpenEdit= false;
     @api objectApiName; 
     
     @track error; 
     @api NewProject ={};
     @api project ={};
     @api prj ={};
     @api projectObject={};
  
   @track isModalOpen = false;
  openModal() {
     this.isModalOpen = true; 
  }
  closeModal() {
     this.isModalOpen = false;
  }
  handleNameChange(event) {
    this.projectObject.Name = event.target.value;
  }
  
  handleSpecificationChange(event) {
    this.projectObject.Specifications = event.target.value;
  }
  handleDatebeginChange(event) {
   this.projectObject.Date_begin = event.target.value;
  }
  handleDateendChange(event) {
   this.projectObject.Date_end = event.target.value;
  }
  handleMemberChange(event) {
   this.projectObject.Members = event.target.value;
  }
  handleDepartmentChange(event) {
    this.projectObject.Department = event.target.value;
   }
   
  submitDetails() {
     console.log('member',this.projectObject.Members)
     console.log('manager',this.projectObject.Department)
     createProject({ ProjectRecObj: this.projectObject })
              .then(result => {
                this.projectRecoredId = result.Id;
                window.console.log('projectRecoredId##Vijay2 ' + this.projectRecoredId);  
                  console.log('success' + result);
                  this.isModalOpen = false;
                  this.projectObject = {};
                  this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Department created successfully..!',
                        variant: 'success',
                    }),
                );
                refreshApex(this.wiredProjects);
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: result.Id,
                        objectApiName: 'Project__c',
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
                getProject({ ProjectId: row.Id })
                  .then(result => {
               console.log('test', result[0])
                      this.project = result[0];
                      this.NewProject.Id = this.project.Id;
                      this.openModalEdit();
                      console.log('test1', result[0])
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
    openModalEdit() {
        console.log('hi')
        this.isModalOpenEdit = true; 
    }
    closeModalEdit() {
        this.isModalOpenEdit = false;
    }
    handleNameEdit(event) {
      this.NewProject.Name = event.target.value;
    }
    
    
    handleSpecificationEdit(event) {
    this.NewProject.Specifications__c = event.target.value;
    }
    handledepartmentEdit(event) {
    this.NewProject.Department__c = event.target.value;
    }
    handleMembresEdit(event) {
        this.NewProject.Members__c = event.target.value;
        }
    handleDatebeginEdit(event) {
      this.NewProject.Date_begin__c = event.target.value;
      }
      handleDateendEdit(event) {
        this.NewProject.Date_end__c = event.target.value;
        }
        
      submitDetailsEdit() {
     console.log('hi', this.NewProject.Department__c)
     console.log('hi', this.NewProject.Member__c)
        updateProject({ prj: this.NewProject })
            .then(result  => {
                this.projectRecoredId = result.Id;
                window.console.log('projectRecoredId##Vijay2 ' + this.projectRecoredId);  
                console.log('success' + result);

                console.log('tested',this.project);
                this.NewProject = {}
                console.log('teste',this.NewProject);
                this.isModalOpenEdit = false;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Project updated successfully..!',
                        variant: 'success',
                    }),
                );
                refreshApex(this.wiredProjects);
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: result.Id,
                        objectApiName: 'Project__c',
                        actionName: 'view'
                    },
                });
                
                
            });
    }
}