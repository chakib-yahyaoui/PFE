import { LightningElement, wire } from 'lwc';
import getOpportunities from '@salesforce/apex/GEN_ChartController.getOpportunities';
import getOpportunities1 from '@salesforce/apex/GEN_ChartController.getOpportunities1';
import getOpportunities2 from '@salesforce/apex/GEN_ChartController.getOpportunities2';
import getOpportunities3 from '@salesforce/apex/GEN_ChartController.getOpportunities3';
import getOpportunities4 from '@salesforce/apex/GEN_ChartController.getOpportunities4';
import getOpportunities5 from '@salesforce/apex/GEN_ChartController.getOpportunities5';

 
export default class Gen_opportunitychart extends LightningElement {
    chartConfiguration;
    @wire(getOpportunities1)
    number1;
    @wire(getOpportunities2)
    number2;
    @wire(getOpportunities3)
    number3;
    @wire(getOpportunities4)
    number4;
    @wire(getOpportunities5)
    number5;
    
    @wire(getOpportunities)
    
    getOpportunities({ error, data }) {
        if (error) {
            this.error = error;
            this.chartConfiguration = undefined;
        } else if (data) {
            let chartAmtData = [];
            let chartRevData = [];
            let chartLabel = [];
            data.forEach(opp => {
                chartAmtData.push(opp.amount);
                chartRevData.push(opp.expectRevenue);
                chartLabel.push(opp.stage);
                
            });
 
            this.chartConfiguration = {
                type: 'bar',
                data: {
                    datasets: [{
                            label: 'Amount',
                            backgroundColor: "#1190CB",
                            data: chartAmtData,
                            
                        },
                        {
                            label: 'Expected Revenue',
                            backgroundColor: "pink",
                            data: chartRevData,
                            
                        },
                        
                        
                        
                    ],
                    labels: chartLabel,
                },
                options: {
                    
                },
            };
            console.log('data => ', data);
            this.error = undefined;
        }
    }
    
}