import { LightningElement,api } from 'lwc';
import chartjs from '@salesforce/resourceUrl/ChartJs';
import ChartDataLabels from '@salesforce/resourceUrl/chartjsPlugin';
import {loadScript} from 'lightning/platformResourceLoader';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
export default class Chart extends LightningElement {
    isChartJsInitialized = false;
    _chartColor;
    _chartLevel;
    _chartValue;
    myChart;

    @api
    get chartLevel(){
        return this._chartLevel
    }
    set chartLevel(value){
        this._chartLevel=value;
    }
    @api
    get chartValue(){
        return this._chartValue
    }
    set chartValue(value){
        this._chartValue=value;
    }
    @api
    get chartColor(){
        return this._chartColor
    }
    set chartColor(value){
        this._chartColor=value;
    }
    rendredCallBack(){
        var check;
        this.createChart(this.check);
        if(this.isChartJsInitialized){
            return;
        }
        Promise.all([loadSceipt(this,chartjs)])
        .then(()=>{
            Promise.all([loadScript(this, ChartDataLabels)])
            .then(()=>{
                this.isChartJsInitialized=true;
                this.createChart(1);
                this.check=1;
            })
            .catch(error=>{
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error Loading Chart',
                        message: error.message,
                        variant: 'error',
                    })
                );
            });
        }
        )
        .catch(error=>{
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error Loading Chart',
                    message: error.message,
                    variant: 'error',
                })
            );
        });
        
    }
    createChart(condition){
        if(typeof(this.muChart) != "undefined"){
            this.myChart.destroy();
        }
        if(condition === 1 ){
            const ctx = this.template.querySelector('canvas.pieChart').getContext('2d');
            this.myChart = new Chart(ctx,{
                type:"pie",
                data:{
                    datasets:[
                        {
                            data:this._chartValue,
                            backgroundColor:this._chartColor,
                        }
                    ],
                    labels:this._chartLevel,
                },
                options:{
                    legend:{
                        position:"botton",
                        display:true,
                    },
                    responsive:true,
                    tooltips:{
                        enabled:true,
                        mode:"point",
                    },
                    plugins:{
                        labels:{
                            render: 'value',
                            fontSize:18,
                            fontColor: '#ffffff',
                            fontFamily:'"Times New Roman",Times,serif'
                        }
                    },
                }
            });
            this.myChart.data.datasets[0].data = this._chartValue;
            this.myChart.update();
            this.myChart.data.datasets[0].data = this._chartLevel;
            this.myChart.update();
            this.myChart.data.datasets[0].data = this._chartColor;
            this.myChart.update();
        }
    }

    
}