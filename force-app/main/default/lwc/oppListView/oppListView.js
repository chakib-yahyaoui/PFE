import { LightningElement, wire } from 'lwc';
import allOppRecords from '@salesforce/apex/wireDecoratorLwcCtrl.allOppRecords';

export default class OppListView extends LightningElement {
    @wire(allOppRecords)
    records;
}