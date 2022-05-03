import { LightningElement, api } from "lwc";

export default class PreviewFileModal extends LightningElement {
  @api url;
  @api fileExtension;
  showFrame = false;
  showModal = false;
  @api show() {
    console.log("###showFrame : " + this.fileExtension);
    if (this.fileExtension === "pdf") this.showFrame = true;
    else this.showFrame = false;
    this.showModal = true;
  }
  closeModal() {
    this.showModal = false;
  }
}