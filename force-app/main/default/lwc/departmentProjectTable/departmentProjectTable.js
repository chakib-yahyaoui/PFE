import { LightningElement, api, track, wire } from 'lwc';
import { CloseActionScreenEvent } from 'lightning/actions';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import fetchProjects from '@salesforce/apex/DepartmentController.fetchProjects';
import dmlOnProjects from '@salesforce/apex/DepartmentController.dmlOnProjects';
import { refreshApex } from '@salesforce/apex';

export default class DepartmentProjectTable extends LightningElement {
    @api recordId;
    @track isLoading = true;
    @track records;
    wiredRecords;
    error;
    @track deleteProjectIds = '';
 
    //to close quick action
    closeAction(){
        this.dispatchEvent(new CloseActionScreenEvent());
    }
 
    //to add row
    addRow() {
        let randomId = Math.random() * 16;
        let myNewElement = {Name: "",Specifications__c: "",Date_begin__c:"",Date_end__c:"", Department__c: this.recordId};
        this.records = [...this.records, myNewElement];
    }
 
    get isDisable(){
        return (this.isLoading || (this.wiredRecords.data.length == 0 && this.records.length == 0));
    }
 
    //show/hide spinner
    handleIsLoading(isLoading) {
        this.isLoading = isLoading;
    }
 
    //update table row values in list
    updateValues(event){
        var foundelement = this.records.find(ele => ele.Id == event.target.dataset.id);
        if(event.target.name === 'Name'){
            foundelement.Name = event.target.value;
        } else if(event.target.name === 'Specifications__c'){
            foundelement.Specifications__c = event.target.value;
        } 
        else if(event.target.name === 'Date_begin__c'){
            foundelement.Date_begin__c = event.target.value;
        }
        else if(event.target.name === 'Date_end__c'){
            foundelement.Date_end__c = event.target.value;
        }
         
    }
 
    //handle save and process dml 
    handleSaveAction(){
        this.handleIsLoading(true);
 
        if(this.deleteProjectIds !== ''){
            this.deleteProjectIds = this.deleteProjectIds.substring(1);
        }
 
        this.records.forEach(res =>{
            if(!isNaN(res.Id)){
                res.Id = null;
            }
        });
         
        dmlOnProjects({data: this.records, removeProjectIds : this.deleteProjectIds})
        .then( result => {
            this.handleIsLoading(false);
            refreshApex(this.wiredRecords);
            this.updateRecordView(this.recordId);
            this.closeAction();
            this.showToast('Success', result, 'Success', 'dismissable');
        }).catch( error => {
            this.handleIsLoading(false);
            console.log(error);
            this.showToast('Error updating or refreshing records', error.body.message, 'Error', 'dismissable');
        });
    }
 
    //remove records from table
    handleDeleteAction(event){
        if(isNaN(event.target.dataset.id)){
            this.deleteProjectIds = this.deleteProjectIds + ',' + event.target.dataset.id;
        }
        this.records.splice(this.records.findIndex(row => row.Id === event.target.dataset.id), 1);
    }
 
    //fetch account contact records
    @wire(fetchProjects, {recordId : '$recordId'})  
    wiredProject(result) {
        this.wiredRecords = result; // track the provisioned value
        const { data, error } = result;
 
        if(data) {
            this.records = JSON.parse(JSON.stringify(data));
            this.error = undefined;
            this.handleIsLoading(false);
        } else if(error) {
            this.error = error;
            this.records = undefined;
            this.handleIsLoading(false);
        }
    } 
 
    showToast(title, message, variant, mode) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode: mode
        });
        this.dispatchEvent(event);
    }
 
    updateRecordView() {
       setTimeout(() => {
            eval("$A.get('e.force:refreshView').fire();");
       }, 3000); 
    }
}