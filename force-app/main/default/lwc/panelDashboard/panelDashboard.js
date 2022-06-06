import { LightningElement,api,wire,track } from 'lwc';


export default class PanelDashboard extends LightningElement {
    @api percentage;

    get style() {
        return `width: ${this.percentage}%`;
    }
}