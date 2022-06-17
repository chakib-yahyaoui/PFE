import { LightningElement,api,wire,track } from 'lwc';
import getOpportunitiesNumber from "@salesforce/apex/GEN_ChartController.getOpportunitiesNumber";


export default class PanelDashboard extends LightningElement {
    @wire(getOpportunitiesNumber)
    number;
}