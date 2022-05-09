import { LightningElement, wire, track} from 'lwc';
import fetchWrapperData from '@salesforce/apex/AccountWrapper.fetchWrapperData';
 
const columns = [
        { 
            label: 'Account Name',
            fieldName: 'accountLink',
            type:'url',
            typeAttributes: {
                label: { 
                    fieldName: 'accountName'
                },
                target : '_blank'
            }
        },
        {
            label: 'Type',
            fieldName: 'type',
            type: 'text',
            sortable: true
        },
        {
            label: 'Total Contact',
            fieldName: 'totalContact',
            type: 'Number',
            sortable: true
        },
        {
            label: 'Billing Address',
            fieldName: 'billingAddress',
            type: 'text',
            wrapText: true,
        },
    ];
export default class WrapperLWCDatatableTechdicer extends LightningElement {
 
    @track columns = columns
    @track error;
    @track data ;
 
    @wire(fetchWrapperData)
    wiredAccounts({error, data}) {
        if (data) {
            console.log(data);
            this.data = data;
        } else if (error) {
            this.error = error;
        }
    }
}