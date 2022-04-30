import { LightningElement, wire, api, track} from 'lwc';
import { refreshApex } from '@salesforce/apex';
import createDepartment from '@salesforce/apex/departmentListViewHelper.createDepartment';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import updateDepartment from '@salesforce/apex/departmentListViewHelper.updateDepartment';
import departmentObject from '@salesforce/schema/Department__c';
import getUserList from '@salesforce/apex/departmentListViewHelper.getUserList';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';

export default class LwcCreateContactCustomLookup extends NavigationMixin(LightningElement) {   
    @wire(getUserList) User;
   @track wiredgetUser;
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
submitDetails() {
    console.log('hiii',this.departmentObject.Project_Manager)
    createDepartment({ DepartmentRecObj: this.departmentObject })
             .then(result => {
                 console.log('success' + result);
                 this.isModalOpen = false;
                 this.departmentObject = {};
 
              })
               .catch(error => {
                 this.error = error.message;
                 console.log("errooorrr", error);
                 this.errorAdd = true;

             });
         }
handleNameChange(event) {
    this.departmentObject.Name = event.target.value;
}

handleDescriptionChange(event) {
    this.departmentObject.Description = event.target.value;
}
}