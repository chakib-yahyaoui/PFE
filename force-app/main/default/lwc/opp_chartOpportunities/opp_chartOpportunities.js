import { LightningElement, wire } from 'lwc';
import getOpportunities from '@salesforce/apex/GEN_ChartController.getOpportunitiees';
 
export default class Gen_opportunitychart extends LightningElement {
    chartConfiguration;
 
    @wire(getOpportunities)
    getOpportunities({ error, data }) {
        if (error) {
            this.error = error;
            this.chartConfiguration = undefined;
        } else if (data) {
            let chartAmtData = [];
            let chartLabel = [];
            data.forEach(opp => {
                chartLabel.push(opp.stage);
            });
 
            this.chartConfiguration = {
                type: 'pie',
                data: {
                    datasets: [{
                            label: 'stage',
                            backgroundColor: "#1190CB",
                            data: chartAmtData,
                        },
                        
                    ],
                    labels: chartLabel,
                },
                options: {},
            };
            console.log('data => ', data);
            this.error = undefined;
        }
    }
}