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
export default class NavigateAction extends NavigationMixin(LightningElement) {
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
    @api recordId;
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
    
 
   
    actionToCreateAccountNav() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Account',
                actionName: 'new'
            },
        });
    }
    
   
    actionToAccountListViewNav() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Account',
                actionName: 'list'
            },
            state: {
                filterName: 'Recent'
            },
        });
    }
 
    
    actionToContactHomeNav() {
        this[NavigationMixin.Navigate]({
            "type": "standard__objectPage",
            "attributes": {
                "objectApiName": "Contact",
                "actionName": "home"
            }
        });
    }
 
    
    actionToFilesHomeNav() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'ContentDocument',
                actionName: 'home'
            },
        });
    }
    
    
    actionToHomeNav() {
        this[NavigationMixin.Navigate]({
            type: 'standard__namedPage',
            attributes: {
                pageName: 'home'
            },
        });
    }
    
    
    
 
    
   
    actionToReportsNav() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Report',
                actionName: 'home'
            },
        });
    }
   
    
    actionToWebNav() {
        this[NavigationMixin.Navigate]({
            "type": "standard__webPage",
            "attributes": {
                "url": "/apex/OpportunityViewVfp"
            }
        });
    }
 
 
    actionToVFNav() {
        this[NavigationMixin.GenerateUrl]({
            type: 'standard__webPage',
            attributes: {
                url: '/apex/wrapperRelatedListVfp?id=' + this.recordId
            }
        }).then(generatedUrl => {
            window.open(generatedUrl);
        });
    }
    
    
}