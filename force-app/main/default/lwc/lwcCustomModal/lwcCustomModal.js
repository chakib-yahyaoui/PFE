import { LightningElement, wire, api, track} from 'lwc';
import { refreshApex } from '@salesforce/apex';
import createProject from '@salesforce/apex/projectListViewHelper.createProject';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import updateDepartment from '@salesforce/apex/departmentListViewHelper.updateDepartment';
import projectObject from '@salesforce/schema/Project__c';
import getDepartment from '@salesforce/apex/projectListViewHelper.getProjectList';
import getUserList from '@salesforce/apex/departmentListViewHelper.getUserList';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
 
export default class LwcCustomModal extends LightningElement {

  @wire(getUserList) User;
  @track wiredgetUser;
  @track departmentRecoredId;
   @wire(getObjectInfo, { objectApiName: departmentObject })
   departmentInfo;

   
   @track isModalOpenEdit= false;
   @api objectApiName; 
   
   @track error; 
   @api NewDepartment ={};
   @api department ={};
   
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
                
                this.isModalOpen = false;
                this.departmentObject = {};
                this.dispatchEvent(
                  new ShowToastEvent({
                      title: 'Success',
                      message: 'Department created successfully..!',
                      variant: 'success',
                  }),
              );
              this[NavigationMixin.Navigate]({
                  type: 'standard__recordPage',
                  attributes: {
                      recordId: 'a008d000003IDokAAG',
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

   
}