import { LightningElement, wire, api, track} from 'lwc';
import { refreshApex } from '@salesforce/apex';
import createProject from '@salesforce/apex/projectListViewHelper.createProject';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import projectObject from '@salesforce/schema/Project__c';
import getUserList from '@salesforce/apex/projectListViewHelper.getUserList';
import getDepartmentList from '@salesforce/apex/projectListViewHelper.getDepartmentList';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
 
export default class LwcCustomModal extends LightningElement {
    
  wiredProjects;
  selectedProjects;
  baseData;
  @track customFormModal = false; 
  @track projectRecoredId;
  @wire(getUserList) User;
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
   
}