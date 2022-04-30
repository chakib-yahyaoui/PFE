import { LightningElement, track, wire } from 'lwc';
import getCustomLookupDepartment from '@salesforce/apex/lwcDepLookupController.getCustomLookupDepartment';

export default class LwcDepartmentLookupProject extends LightningElement {
    @track departmentName='';
    @track departmentList=[];
    @track objectApiName='Department__c';
    @track departmentId;
    @track isShow=false;
    @track messageResult=false;
    @track isShowResult = true;
    @track showSearchedValues = false;
    @wire(getCustomLookupDepartment,{prjtName:'$departmentName'})
    retrieveDepartments ({error,data}){
        this.messageResult=false;
        if(data){
            console.log('data## ' + data.length);
            if(data.length>0 && this.isShowResult){
               this.departmentList =data;
               this.showSearchedValues=true;
               this.messageResult=false;
            }
            else if(data.length == 0){
               this.departmentList=[];
               this.showSearchedValues=false;
               if(this.departmentName != ''){
                  this.messageResult=true;
               }
            }
            else if(error){
                this.departmentId='';
                this.departmentName='';
                this.departmentList=[];
                this.showSearchedValues=false;
                this.messageResult=true;
            }
    
        }
    }
    
    
    
    searchHandleClick(event){
     this.isShowResult = true;
     this.messageResult = false;
   }
    
    
   searchHandleKeyChange(event){
     this.messageResult=false;
     this.departmentName = event.target.value;
   }
    
   parentHandleAction(event){        
       this.showSearchedValues = false;
       this.isShowResult = false;
       this.messageResult=false;
       //Set the parent calendar id
       this.departmentId =  event.target.dataset.value;
       //Set the parent calendar label
       this.departmentName =  event.target.dataset.label;      
       console.log('departmentId::'+this.departmentId);    
       const selectedEvent = new CustomEvent('selected', { detail: this.departmentId });
           // Dispatches the event.
       this.dispatchEvent(selectedEvent);    
   }
    
   }