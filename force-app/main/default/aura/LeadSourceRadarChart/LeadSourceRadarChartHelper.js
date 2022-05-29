({
    setupRadarChart : function(component) {
        
        var action = component.get("c.getLeadJSON");
        action.setCallback(this, function(a){
            var jsonRetVal = JSON.parse(a.getReturnValue()); 
            console.log(jsonRetVal.radarLabels);
            
            var radarChartData = {
			labels: jsonRetVal.radarLabels,
			datasets: [
                { 
                    fillColor: "rgba(220,220,220,0.2)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: jsonRetVal.radarData
                }
            ]
        };
      
        var el = component.find('radarChart').getElement();
        var ctx = el.getContext('2d');
        new Chart(ctx).Radar(radarChartData);   
            
        });
        $A.enqueueAction(action); 
	},  
	
})