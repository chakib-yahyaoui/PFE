import { LightningElement, api, track } from 'lwc';
import deleteContact from '@salesforce/apex/RefreshStandardComponentCtrl.deleteContact';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
 
export default class RefreshStandardComponent extends LightningElement {
    @api recordId;
    @track isLoading = false;
 
    handleClick() {
        this.handleIsLoading(true);
        deleteContact({ recordId: this.recordId }).then(result => {
            this.showToast('Success', result, 'Success', 'dismissable');
            this.updateRecordView();
        }).catch(error => {
            this.showToast('Error updating or refreshing records', error.body.message, 'Error', 'dismissable');
        }).finally(()=>{
            this.handleIsLoading(false);
        });
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
 
    //show/hide spinner
    handleIsLoading(isLoading) {
        this.isLoading = isLoading;
    }
 
    updateRecordView() {
       setTimeout(() => {
            eval("$A.get('e.force:refreshView').fire();");
       }, 1000); 
    }
}