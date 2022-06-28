({
    CreateChart : function(component) {
        var chartType=component.get("v.selectedChartType").toLowerCase();
        if(chartType == 'polar area'){
            let values = chartType.split(" ");
            let firstChar = values[0];
            let secondChar = values[1];
            chartType = firstChar+''+secondChar.charAt(0).toUpperCase() + secondChar.slice(1);
        }
        var action=component.get("c.getReportData");
        action.setParams({"reportName":component.get("v.selectedReport")});
        action.setCallback(this,function(response){
            var state=response.getState();
            if(state=='SUCCESS'){
                var reportResult = JSON.parse(response.getReturnValue());
                var data = [];
                var Label= [];
                if((reportResult.groupingsDown.groupings)!=null){
                    for(var i=0; i < (reportResult.groupingsDown.groupings.length); i++){
                        var tLabel = reportResult.groupingsDown.groupings[i].label;
                        Label.push(tLabel);
                        var tKey = reportResult.groupingsDown.groupings[i].key;
                        var tValue = reportResult.factMap[tKey + '!T'].aggregates[0].value;
                        data.push(tValue);
                    }
                }
                //Create chart
                var el=component.find('myChart').getElement();
                var ctx=el.getContext('2d');
                if(window.bar!=undefined){
                    window.bar.destroy();
                }
                var background_color=new Array();
                for(var i=0 ; i<10 ; i++){
                    var w,x,y,z;
                    w = parseInt(Math.random()*255);
                    x = parseInt(Math.random()*255);
                    y = parseInt(Math.random()*255);
                    z = Math.random();
                    background_color.push('rgba('+w+','+x+','+y+','+z+')');  
                }
                window.bar = new Chart(ctx, {
                    type: chartType,
                    data: {
                        labels: Label,
                        datasets: [
                            {
                                label: "Data",
                                fillColor: background_color,
                                backgroundColor: background_color,
                                strokeColor: "rgba(220,220,220,1)",                
                                data: data
                            }
                        ]
                    },
                    options: {
                        hover: {
                            mode: "none"
                        },
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero:true
                                }
                            }]
                        }
                    }
                });
            }
            
        });
        $A.enqueueAction(action);
    },
    loadSettings:function(component,event,helper){
        
    },
    getReports:function(component,event,helper){
        var chartTypeOption = ['Pie','Bar','Doughnut','Polar Area'];
        var action=component.get("c.fetchReports");
        action.setCallback(this,function(response){
            var state=response.getState();
            if(state=='SUCCESS'){
                var result=response.getReturnValue();
                var chartTypeOptions =[];
                var options =[];
                var selectedReport = component.get("v.selectedReport");
                var selectedChartType = component.get("v.selectedChartType");
                console.log('chartTypeOption: '+chartTypeOption);
                for (let index = 0; index < chartTypeOption.length; index++) { 
                    var isSelected = false;
                    if(selectedChartType!=null){
                        if(selectedChartType == chartTypeOption[index]){
                            isSelected = true;
                        }
                    }
                    else{
                        component.set("v.selectedChartType",chartTypeOption[0]);
                    }
                    chartTypeOptions.push({ label: chartTypeOption[index], value: chartTypeOption[index], selected: isSelected});
                }
                component.set("v.chartType",chartTypeOptions); 
                for (let index = 0; index < result.length; index++) { 
                    var isSelected = false;
                    if(selectedChartType!=null){
                        if(selectedReport == result[index]){
                            isSelected = true;
                        }
                    }
                    else{
                        component.set("v.selectedReport",result[0]);
                    }
                    options.push({ label: result[index], value: result[index], selected: isSelected});
                }
                component.set("v.reports",options);
                this.CreateChart(component,event,helper);
            }
        });
        $A.enqueueAction(action);
    },
    updateSettings:function(component,event,helper){
        let action = component.get('c.updateSettings');
        action.setParams({
            "chartType": component.get("v.selectedChartType"),
            "reportName" : component.get("v.selectedReport")
        });
        action.setCallback(this,function(response){
           let state = response.getState();
            if(state == 'SUCCESS'){
                let result = response.getReturnValue();
                
            }else{
                console.log('Something went wrong!');
            }
        });
        $A.enqueueAction(action);
    }
})