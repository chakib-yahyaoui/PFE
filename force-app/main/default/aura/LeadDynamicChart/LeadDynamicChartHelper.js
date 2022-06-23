({
    doInit : function(component, event, helper) 
    {
        var action = component.get("c.getLeadJSON"); 
        action.setCallback(this, function(response) { 
            var state = response.getState(); 
            //alert(state);
            if (state === "SUCCESS") { 
                var dataObj= response.getReturnValue(); 
                //jsonData = dataObj;
                console.log('===='+dataObj);
                component.set("v.data",dataObj);
                helper.piechart(component,event,helper);
                helper.Linechart(component,event,helper);
                helper.donutchart(component,event,helper);
                helper.barchart(component,event,helper);
            } 
        });
        $A.enqueueAction(action);
    },
    
   
    piechart : function(component,event,helper) {
        var jsonData = component.get("v.data");
        var dataObj = JSON.parse(jsonData);
        
        new Highcharts.Chart({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                renderTo: component.find("chart").getElement(),
                type: 'pie'
            },
            title: {
                text: component.get("v.chartTitle")+' (Pie Chart)'
            },
            subtitle: {
                text: component.get("v.chartSubTitle")
            },
            xAxis: {
                categories: component.get("v.xAxisCategories"),
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: 
                {
                    text: component.get("v.yAxisParameter")
                }
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.y}</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.y} ',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            },
            series: [{
                name:'Status',
                data:dataObj
            }]
            
        });
        
    },
    Linechart : function(component,event,helper) {
        var jsonData = component.get("v.data");
        var dataObj = JSON.parse(jsonData);
        
        new Highcharts.Chart({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                renderTo: component.find("linechart").getElement(),
                type: 'line'
            },
            title: {
                text: component.get("v.chartTitle")+' (Line Chart)'
            },
            subtitle: {
                text: component.get("v.chartSubTitle")
            },
            xAxis: {
                type: 'category',

            },
            yAxis: {
                min: 0,
                title: 
                {
                    text: component.get("v.yAxisParameter")
                }
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.y}</b>'
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    },
                    enableMouseTracking: false
                }
            },
            series: [{
                name:'Status',
                data:dataObj
            }]
            
        });
        
    },
    
    
});