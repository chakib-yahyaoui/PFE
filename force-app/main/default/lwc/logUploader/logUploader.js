import { LightningElement, track } from 'lwc';

 

const COLS = [

    { label: 'Date', fieldName: 'Date' },

    { label: 'User', fieldName: 'User'},

    { label: 'Action', fieldName: 'Action'},

    { label: 'Section', fieldName: 'Section'}

];

export default class LogUploader extends LightningElement {
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

 

}