import { LightningElement, api } from "lwc";

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import {CloseActionScreenEvent} from 'lightning/actions'



export default class Contactedit extends LightningElement {
  @api recordId
  @api objectApiName
  handleSuccess(e){
      this.dispatchEvent(new CloseActionScreenEvent());
      this.dispatchEvent(
          new ShowToastEvent(
              {
                title: 'Sucess',
                message : 'Contact Record Updated !! ',
                variant : 'success'
              }
          )
      );
  }
  closeAction(){
      this.dispatchEvent(new CloseActionScreenEvent());
  }
  
}