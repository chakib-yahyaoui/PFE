import { LightningElement, wire, api } from "lwc";
import getTickets from "@salesforce/apex/ProjectController.getTickets";
import { refreshApex } from "@salesforce/apex";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import updateTickets from "@salesforce/apex/ProjectController.updateTickets";
import { getRecordNotifyChange } from "lightning/uiRecordApi";
const COLS = [
    { label: "Name", fieldName: "Name", editable: true },
    { label: "Numero Ticket", fieldName: "N_Ticket__c", editable: true },
    { label: "Priority", fieldName: "Priority__c", editable: true },
    { label: "Description", fieldName: "Description__c",editable: true  },
    { label: "Date debut", fieldName: "date_debut__c",editable: true  },
    { label: "Date fin", fieldName: "End_Date__c",editable: true  },
  ];
export default class TicketForProject extends LightningElement {
    @api recordId;
    columns = COLS;
    draftValues = [];
  
    @wire(getTickets, { prjId: "$recordId" })
    ticket;
  
    async handleSave(event) {
      const updatedFields = event.detail.draftValues;
  
      // Prepare the record IDs for getRecordNotifyChange()
      const notifyChangeIds = updatedFields.map((row) => {
        return { recordId: row.Id };
      });
      console.log("###RecordIds : " + JSON.stringify(notifyChangeIds));
      try {
        const result = await updateTickets({ data: updatedFields });
        console.log(JSON.stringify("Apex update result: " + result));
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Success",
            message: "Ticket updated",
            variant: "success"
          })
        );
  
        // Refresh LDS cache and wires
        getRecordNotifyChange(notifyChangeIds);
  
        // Display fresh data in the datatable
        refreshApex(this.ticket).then(() => {
          // Clear all draft values in the datatable
          this.draftValues = [];
        });
      } catch (error) {
        console.log("###Error : " + JSON.stringify(error));
      }
    }
}