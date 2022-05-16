import {LightningElement} from 'lwc';
import {loadScript} from "lightning/platformResourceLoader";
import JSPDF from '@salesforce/resourceUrl/jspdf';
import getopportunities from '@salesforce/apex/PdfGenerator.getOpportunitiesController';

export default class createPDF extends LightningElement {
	opportunityList = [];
	headers = this.createHeaders([
		"Id",
		"Name",
		"CloseDate",
        
	]);

	renderedCallback() {
        console.log("HEEEHI",this);
		Promise.all([
			loadScript(this, JSPDF)
		]);
	}

	generatePdf(){
		const { jsPDF } = window.jspdf;
		const doc = new jsPDF();

		doc.text("Hi I'm Souha", 20, 20);
        console.log("hi");
        console.log(doc.text);
		doc.table(30, 30, this.opportunitytList, this.headers, { autosize:true });
        console.log("hiiii");
		doc.save("demo.pdf");
	}

	generateData(){
        console.log('helooo');
		getopportunities().then(result=>{
            console.log('result', result);
			this.opportunityList = result;
            console.log('list', this.opportunityList);
			this.generatePdf();
		});
	}

	createHeaders(keys) {
		let result = [];
		for (let i = 0; i < keys.length; i += 1) {
			result.push({
				id: keys[i],
				name: keys[i],
				prompt : keys[i],
				width: 65,
				align: "center",
				padding: 0
			});
		}
		return result;
	}

}