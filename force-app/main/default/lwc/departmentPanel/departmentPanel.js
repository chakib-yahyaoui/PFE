import { LightningElement, api, track } from 'lwc';
import { deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import { CloseActionScreenEvent } from 'lightning/actions';


export default class DepartmentPanel extends NavigationMixin(LightningElement) {
    // Flexipage provides recordId and objectApiName
    @api recordId;
    @api objectApiName;
    
    @track error;
    deleteRecord(event) {
        deleteRecord(this.recordId)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Record deleted',
                        variant: 'success'
                    })
                );
                // Navigate to a record home page after
                // the record is deleted, such as to the
                // contact home page
                this[NavigationMixin.Navigate]({
                    type: 'standard__navItemPage',
                    attributes: {
                        apiName: 'Department_page'
                 },
             });
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
handleSuccess() {

    // Close the modal window and display a success toast
    
            this.dispatchEvent(new CloseActionScreenEvent());
    
            this.dispatchEvent(
    
                new ShowToastEvent({
    
                    title: 'Success',
    
                    message: 'Ticket Record Updated!',
    
                    variant: 'success'
    
                })
    
            );
    
       }
}