/* eslint-disable guard-for-in */
import { LightningElement, api ,track} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';

import { createRecord, updateRecord, deleteRecord } from 'lightning/uiRecordApi';

// Static resources
import GanttFiles from '@salesforce/resourceUrl/dhtmlxgantt713';

// Controllers
import getTasks from '@salesforce/apex/GanttData.getTasks';
const COLS = [

    { label: 'Date', fieldName: 'Date' },

    { label: 'User', fieldName: 'User'},

    { label: 'Action', fieldName: 'Action'},

    { label: 'Section', fieldName: 'Section'}

];

function unwrap(fromSF){
    const data = fromSF.tasks.map(a => ({
        id: a.Id,
        text: a.Name,
        start_date: a.Start_Date__c,
        duration: a.Duration__c,
        parent: a.Parent__c,
        progress: a.Progress__c,
    }));
    const links = fromSF.links.map(a => ({
        id: a.Id,
        source: a.Source__c,
        target: a.Target__c,
        type: a.Type__c
    }));
    return { data, links };
}

export default class GanttView extends LightningElement {
    @track columns = COLS;

    @track data;

    @track showLoadingSpinner = false;

 

    MAX_FILE_SIZE = 2000000; //Max file size 2.0 MB

    filesUploaded = [];

    filename;

 

    importcsv(event){

        if (event.target.files.length > 0) {

            this.filesUploaded = event.target.files;

            this.filename = event.target.files[0].name;

            console.log(this.filename);

            if (this.filesUploaded.size > this.MAX_FILE_SIZE) {

                this.filename = 'File Size is to long to process';

            }

    }

    }

    readFiles() {

        [...this.template

            .querySelector('lightning-input')

            .files].forEach(async file => {

                try {

                    const result = await this.load(file);

                    // Process the CSV here

                  this.showLoadingSpinner = false;

 

                    console.log(result);

                   // this.processData(result);

                     this.data=JSON.parse(this.csvJSON(result));

                    console.log('data..'+JSON.parse(this.data));

 

                } catch(e) {

                    // handle file load exception

                    console.log('exception....');

                   

                }

            });

    }

   

   

    async load(file) {

        return new Promise((resolve, reject) => {

        this.showLoadingSpinner = true;

            const reader = new FileReader();

            // Read file into memory as UTF-8      

            //reader.readAsText(file);

            reader.onload = function() {

                resolve(reader.result);

            };

            reader.onerror = function() {

                reject(reader.error);

            };

            reader.readAsText(file);

        });

    }

 

     

//process CSV input to JSON

 

 csvJSON(csv){

 

  var lines=csv.split(/\r\n|\n/);

 

  var result = [];

 

  var headers=lines[0].split(",");

  console.log('headers..'+JSON.stringify(headers));

  for(var i=1;i<lines.length-1;i++){

 

   var obj = {};

   var currentline=lines[i].split("\",\"");

   

   for(var j=0;j<headers.length;j++){

           

                obj[headers[j]] = currentline[j];

               

   }

   result.push(obj);

 

  }

  console.log('result..'+JSON.stringify(result));

  //return result; //JavaScript object

 

  return JSON.stringify(result); //JSON

  /* const UsersOnly = JSON.parse(result).filter(({Section}) => Section === 'Manage Users');

  console.log(UsersOnly); */

}
    static delegatesFocus = true;

    @api height;
    ganttInitialized = false;

    renderedCallback() {
        if (this.ganttInitialized) {
            return;
        }
        this.ganttInitialized = true;

        Promise.all([
            loadScript(this, GanttFiles + '/dhtmlxgantt.js'),
            loadStyle(this, GanttFiles + '/dhtmlxgantt.css'),
        ]).then(() => {
            this.initializeUI();
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error loading Gantt',
                    message: error.message,
                    variant: 'error',
                }),
            );
        });
    }

    initializeUI(){
        const root = this.template.querySelector('.thegantt');
        root.style.height = this.height + "px";

        //uncomment the following line if you use the Enterprise or Ultimate version
        //const gantt = window.Gantt.getGanttInstance();
        gantt.templates.parse_date = date => new Date(date);
        gantt.templates.format_date = date => date.toISOString();
        gantt.init(root);
        getTasks().then(d => {
            gantt.parse(unwrap(d));
        })

        gantt.createDataProcessor({
            task: {
                create: function(data) {
                    const insert = { apiName: "GanttTask__c", fields:{
                        Name : data.text,
                        Start_Date__c : data.start_date,
                        Duration__c : data.duration,
                        Parent__c : String(data.parent),
                        Progress__c : data.progress
                    }};
                    return createRecord(insert).then(res => {
                        return { tid: 1, ...res };
                    });
                },
                update: function(data, id) {
                    const update = { fields:{
                        Id: id,
                        Name : data.text,
                        Start_Date__c : data.start_date,
                        Duration__c : data.duration,
                        Parent__c : String(data.parent),
                        Progress__c : data.progress
                    }};
                    return updateRecord(update).then(() => ({}));
                },
                delete: function(id) {
                    return deleteRecord(id).then(() => ({}));
                }
             },
             link: {
                create: function(data) {
                    const insert = { apiName: "GanttLink__c", fields:{
                        Source__c : data.source,
                        Target__c : data.target,
                        Type__c : data.type,
                    }};
                    return createRecord(insert).then(res => {
                        return { tid: res.id };
                    });
                },
                update: function(data, id) {
                    const update = { apiName: "GanttLink__c", fields:{
                        Id : id,
                        Source__c : data.source,
                        Target__c : data.target,
                        Type__c : data.type,
                    }};
                    return updateRecord(update).then(() => ({}));
                },
                delete: function(id) {
                    return deleteRecord(id).then(() => ({}));
                }
             }
        }).init(gantt);
    }
}