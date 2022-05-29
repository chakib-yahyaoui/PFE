({
    doInit : function(component, event, helper) 
    {
        var action = component.get("c.getOppJSON"); 
        action.setCallback(this, function(response) { 
            var state = response.getState(); 
            //alert(state);
            if (state === "SUCCESS") { 
                var dataObj= response.getReturnValue(); 
                //jsonData = dataObj;
                console.log('===='+dataObj);
                component.set("v.data",dataObj);
                helper.barchart(component,event,helper);
                
            } 
        });
        $A.enqueueAction(action);
    },
 
    barchart : function(component,event,helper) {
        var jsonData = component.get("v.data");
        var dataObj = JSON.parse(jsonData);
        
        new Highcharts.Chart({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                renderTo: component.find("barchart").getElement(),
                type: 'column',
                options3d: {
                    enabled: true,
                    alpha: 5,
                    beta : 25,
                    depth: 50,
                    viewDistance: 25
                }
                
            },
            title: {
                text: component.get("v.chartTitle")
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
                column: {
            depth: 25
        },
                line: {
                    dataLabels: {
                        enabled: true
                    },
                    enableMouseTracking: false
                }
            },
            series: [{
                name:'Count',
                data:dataObj
            }]
            
        });
        
    },
})