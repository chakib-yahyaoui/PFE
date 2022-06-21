import { LightningElement, api,wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import changestage from "@salesforce/apex/OpportunityService.changestage"
import { getRecordNotifyChange } from 'lightning/uiRecordApi';

export default class UpdateStageOpp extends LightningElement {


    @api recordId;

    @wire(changestage, {recordid : '$recordId'})loggedinid({error,data}) {

        if (data) {
            
            console.log("1");
    
            console.log(data);
    
            
        } else if (error) {
    
            this.error = error;
    
            console.log("erreur1")
    
            console.log(JSON.stringify(error));
    
        }
    
    
    
    }
    
    
            
    @api invoke() {
        

        console.log( "Inside Invoke Method" );
        console.log( "Record Id is " + this.recordId );

        changestage({ recordid: this.recordId })
        .then(result => {
            console.log( "aaaaaa " + this.recordId );

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: ' Le stage de a changé avec succés!',
                    variant: 'success',
                })
            ) 

            getRecordNotifyChange([{ recordId: this.recordId }]);
         
      })
     .catch(error => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error ',
                            message: error.body.message,
                            variant: 'error'
                        })
                    );
                });
       
    
        }


}