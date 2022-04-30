import { LightningElement, wire, api, track} from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import departmentObject from '@salesforce/schema/Project__c';
import getUserList from '@salesforce/apex/projectListViewHelper.getUserList';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import updateDepartment from '@salesforce/apex/departmentListViewHelper.updateDepartment';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';



 
export default class LwcCustomModal extends LightningElement {
  @wire(getUserList) User;
  @track wiredgetUser;
   @wire(getObjectInfo, { objectApiName: departmentObject })
   departmentInfo;
  @track isModalOpenEdit= false;
    @api objectApiName; 
    @track page = 1;
    @track error; 
    @track startingRecord = 1;
    @track endingRecord = 0; 
    @track pageSize = 15; 
    @track totalRecountCount = 0;
    @track items = []; 
    @api NewDepartment ={};
    @api department ={};
    @track value;
    @track wiredDataResult;
    @api sortedDirection = 'asc';
    @api sortedBy ;
    @api searchKey = '';
    @api recordId;
    @track recordId ; 
    @track data;
    @track columns = columns;
    @track allorgsData;
    @track totalPage = 0;
    hello= true;
    result;
    loading;
    defaultSortDirection = 'asc';
    @api OrgIdDet;

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
    updateOrg({ department: this.NewDepartment })
        .then(() => {
            console.log('tested',this.department);
            this.NewDepartment = {}
            console.log('teste',this.NewDepartment);
            this.isModalOpenEdit = false;
            refreshApex(this.wiredDataResult) });
}
}