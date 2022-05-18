import { LightningElement, api,track } from 'lwc';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import C3 from '@salesforce/resourceUrl/c3';//load the c3 and d3 from the static resources.
import D3 from '@salesforce/resourceUrl/d3';

export default class TicketPieChart extends LightningElement {
    @api chartData;
  @track chart;
  @track loadingInitialized=false;
  librariesLoaded = false;

  //This is used called when the DOM is rendered.
  renderedCallback() {
    if(this.librariesLoaded)
      this.drawChart();
      //this.librariesLoaded = true;
    if(!this.loadingInitialized) {
      this.loadingInitialized = true;
      /*
        We have added the a parameter t and assigned the current time to it. 
        This is done to make sure the cache is refrehed everytime the scripts are loaded.
        If we do not do this then there is an issues if we add multiple charts in a single component.
      */
      Promise.all([
        loadScript(this, D3 + '/d3.min.js?t='+new Date().getTime()),
        loadScript(this, C3 + '/c3-0.7.20/c3.min.js?t='+new Date().getTime()),
        loadStyle(this, C3 + '/c3-0.7.20/c3.min.css?t='+new Date().getTime()),
      ])
      .then(() => {
        this.librariesLoaded = true;
        //Call the charting method when all the dependent javascript libraries are loaded. 
        this.drawChart();
      })
      .catch(error => {
        console.log('The error ', error);
      });
    }
  }
  drawChart() {
    
    this.chart = c3.generate({
      bindto: this.template.querySelector('div.c3'),//Select the div to which the chart will be bound to.
      data: {
        columns: this.chartData,
        type : 'donut'
      },
      donut : {
        title : 'Tickets',
        label: {
          format: function(value, ratio, id) {
            return value;
          }
        }
      }
    });
  }
  //destroy the chart once the elemnt is destroyed
  disconnectedCallback() {
    this.chart.destroy();
  }
}