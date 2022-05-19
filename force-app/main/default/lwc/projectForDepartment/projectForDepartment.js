import { LightningElement, wire, api } from "lwc";
import getProjects from "@salesforce/apex/ProjectController.getProjects";
import { refreshApex } from "@salesforce/apex";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import updateProjects from "@salesforce/apex/ProjectController.updateProjects";
import getNumberProjects from "@salesforce/apex/ProjectController.getNumberProjects";
import { getRecordNotifyChange } from "lightning/uiRecordApi";

const COLS = [
    { label: "Name", fieldName: "Name", editable: true },
    { label: "Specifications", fieldName: "Specifications__c", editable: true },
    { label: "Date Begin", fieldName: "Date_begin__c", editable: true },
    { label: "Date End", fieldName: "Date_end__c",editable: true  },
  ];
export default class ProjectForDepartment extends LightningElement {
    
  
  @api recordId;
    columns = COLS;
    draftValues = [];
    
    @wire(getNumberProjects)wiredNumbers;
    @wire(getProjects, { depId: "$recordId" })
    project;
  
    async handleSave(event) {
      const updatedFields = event.detail.draftValues;
  
      // Prepare the record IDs for getRecordNotifyChange()
      const notifyChangeIds = updatedFields.map((row) => {
        return { recordId: row.Id };
      });
      console.log("###RecordIds : " + JSON.stringify(notifyChangeIds));
      try {
        const result = await updateProjects({ data: updatedFields });
        console.log(JSON.stringify("Apex update result: " + result));
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Success",
            message: "Project updated",
            variant: "success"
          })
        );
  
        // Refresh LDS cache and wires
        getRecordNotifyChange(notifyChangeIds);
  
        // Display fresh data in the datatable
        refreshApex(this.project).then(() => {
          // Clear all draft values in the datatable
          this.draftValues = [];
        });
      } catch (error) {
        console.log("###Error : " + JSON.stringify(error));
      }
    }
}