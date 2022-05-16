import { LightningElement, wire, api,track } from "lwc";
import getContactList from "@salesforce/apex/ContactController.getContactList";
import { refreshApex } from "@salesforce/apex";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import updateContacts from "@salesforce/apex/ContactController.updateContacts";
import { getRecordNotifyChange } from "lightning/uiRecordApi";


export default class ContactsForAccount extends LightningElement {

  @wire(getContactList) Contact;
  @track wiredgetcontact;
  

  async handleSave(event) {
    const updatedFields = event.detail.draftValues;

    // Prepare the record IDs for getRecordNotifyChange()
    const notifyChangeIds = updatedFields.map((row) => {
      return { recordId: row.Id };
    });
    console.log("###RecordIds : " + JSON.stringify(notifyChangeIds));
    try {
      // Pass edited fields to the updateContacts Apex controller
      const result = await updateContacts({ data: updatedFields });
      console.log(JSON.stringify("Apex update result: " + result));
      this.dispatchEvent(
        new ShowToastEvent({
          title: "Success",
          message: "Contact updated",
          variant: "success"
        })
      );

      // Refresh LDS cache and wires
      getRecordNotifyChange(notifyChangeIds);

      // Display fresh data in the datatable
      refreshApex(this.contact).then(() => {
        // Clear all draft values in the datatable
        this.draftValues = [];
      });
    } catch (error) {
      console.log("###Error : " + JSON.stringify(error));
    }
  }
}