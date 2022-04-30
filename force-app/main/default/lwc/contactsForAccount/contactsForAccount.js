import { LightningElement, wire, api } from "lwc";
import getContacts from "@salesforce/apex/ContactController.getContacts";
import { refreshApex } from "@salesforce/apex";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import updateContacts from "@salesforce/apex/ContactController.updateContacts";
import { getRecordNotifyChange } from "lightning/uiRecordApi";

const COLS = [
  { label: "First Name", fieldName: "FirstName", editable: true },
  { label: "Last Name", fieldName: "LastName", editable: true },
  { label: "Title", fieldName: "Title", editable: true },
  { label: "Phone", fieldName: "Phone", type: "phone",editable: true  },
  { label: "Email", fieldName: "Email", type: "email",editable: true  }
];
export default class ContactsForAccount extends LightningElement {
  @api recordId;
  columns = COLS;
  draftValues = [];

  @wire(getContacts, { accId: "$recordId" })
  contact;

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