import { LightningElement, wire , track,api} from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import contactFirstName from '@salesforce/schema/Contact.FirstName';
import contactLastName from '@salesforce/schema/Contact.LastName';
import contactPhone from '@salesforce/schema/Contact.Phone';
import contactEmail from '@salesforce/schema/Contact.Email';
import accountFieldId from '@salesforce/schema/Contact.AccountId';
import getContacts from "@salesforce/apex/contactListViewHelper.getContacts";
import searchContact from "@salesforce/apex/contactListViewHelper.searchContact";
import deleteContacts from "@salesforce/apex/contactListViewHelper.deleteContacts";
import { refreshApex } from '@salesforce/apex';

const actions = [{label: 'Delete', name: 'delete'},
{label: 'View', name: 'view'},
{label: 'Edit', name: 'edit'}]

const COLS = [{label: 'Name', fieldName: 'link', type: 'url', typeAttributes: {label: {fieldName: 'FullName'}}},
            {label: 'Email', fieldName: 'Email'},
            {label: 'Account', fieldName: "accountLink", type: 'url', typeAttributes: {label: {fieldName: 'AccountName'}}},
            {label: "Mailing Address", fieldName: 'MailingAddress'},
            { fieldName: "actions", type: 'action', typeAttributes: {rowActions: actions}}
]

export default class ContactListView extends NavigationMixin(LightningElement) {
    cols = COLS;
    contacts;
    wiredContacts;
    selectedContacts;
    baseData;
    @track selectedAccountId;
    @track contactId;    
    @track error; 
    firstname = '';   
    lastname = '';  
    phoneNo = '';
    emailId = '';
    @api show() {
        this.showModal = true;
      }
      handleDialogClose() {
        this.showModal = false;
      }
    contactHandleChange(event) {
        console.log(event.target.label);
        console.log(event.target.value);        
        if(event.target.label=='First Name'){
            this.firstname = event.target.value;
        }
        if(event.target.label=='Last Name'){
            this.lastname = event.target.value;
        }   
        
        if(event.target.label=='Phone'){
            this.phoneNo = event.target.value;
        }

        if(event.target.label=='Email'){
            this.emailId = event.target.value;
        }
                   
    }

    createLookupContactAction(){
        console.log(this.selectedAccountId);
        const fields = {};
        fields[contactFirstName.fieldApiName] = this.firstname;
        fields[contactLastName.fieldApiName] = this.lastname;
        fields[contactPhone.fieldApiName] = this.phoneNo;
        fields[contactEmail.fieldApiName] = this.emailId;
        
        fields[accountFieldId.fieldApiName] = this.selectedAccountId;
        const recordInput = { apiName: CONTACT_OBJECT.objectApiName, fields };
        createRecord(recordInput)
            .then(contactobj=> {
                this.contactId = contactobj.id;
                this.fields={};
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Contact created successfully..!',
                        variant: 'success',
                    }),
                );
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: contactobj.id,
                        objectApiName: 'Contact',
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
    myLookupHandle(event){
        console.log(event.detail);
        this.selectedAccountId = event.detail;
    }

    get selectedContactsLen() {
        if(this.selectedContacts == undefined) return 0;
        return this.selectedContacts.length
    }
    @track customFormModal = false; 
    
    customShowModalPopup() {            
        this.customFormModal = true;
    }
 
    customHideModalPopup() {    
        
        this.customFormModal = false;
    }

    @wire(getContacts)
    contactsWire(result){
        this.wiredContacts = result;
        if(result.data){
            this.contacts = result.data.map((row) => {
                return this.mapContacts(row);
            })
            this.baseData = this.contacts;
        }
        if(result.error){
            console.error(result.error);
        }
    }

    mapContacts(row){
        var accountName = '';
        var accountLink = '';
        if(row.AccountId != undefined){
            accountLink = `/${row.AccountId}`;
            accountName = row.Account['Name'];
        }

        var street = row.MailingStreet
        if(row.MailingStreet == undefined){
            street = ''
        }
        var city = row.MailingCity
        if(row.MailingCity == undefined){
            city = ''
        }
        var state = row.MailingState 
        if(row.MailingState == undefined){
            state = ''
        }
        var country = row.MailingCountry 
        if(row.MailingCountry == undefined){
            country = ''
        }
        var zipCode = row.MailingPostalCode
        if(row.MailingPostalCode == undefined){
            zipCode = ''
        }

        return {...row,
            FullName: `${row.FirstName} ${row.LastName}`,
            link: `/${row.Id}`,
            accountLink: accountLink,
            AccountName: accountName,
            MailingAddress: `${street} ${city} ${state} ${zipCode} ${country}`
        };
    }

    handleRowSelection(event){
        this.selectedContacts = event.detail.selectedRows;
    }

    async handleSearch(event){
        if(event.target.value == ""){
            this.contacts = this.baseData
        }else if(event.target.value.length > 0){
            const searchContacts = await searchContact({searchString: event.target.value})

            this.contacts = searchContacts.map(row => {
                return this.mapContacts(row);
            })
        }
    }
    refresh() {
        refreshApex(this.wiredContacts);
      }
    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        this.recordId =  row.Id;
        switch(actionName){
            case 'view':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes:{
                        recordId: row.Id,
                        actionName: 'view'
                    }
                });
                break;
            case 'edit':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes:{
                        recordId: row.Id,
                        objectApiName: 'contact',
                        actionName: 'edit'
                    }
                });
                break;
            case 'delete' :
                deleteContacts({contactIds : [event.detail.row.Id]}).then(() => {
                    refreshApex(this.wiredContacts);
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Record deleted',
                            variant: 'success'
                        })
                        
                    );
                    
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
    }

    deleteSelectedContacts(){
        const idList = this.selectedContacts.map( row => { return row.Id })
        deleteContacts({contactIds : idList}).then( () => {
            refreshApex(this.wiredContacts);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Records deleted',
                    variant: 'success'
                })
                
            );
            
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error deleting records',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });
        this.template.querySelector('lightning-datatable').selectedRows = [];
        this.selectedContacts = undefined;
        
    }
}