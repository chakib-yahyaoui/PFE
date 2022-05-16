({
	scriptsLoaded : function(component, event, helper) {
        
        //create context to instantiate a pre-defined chart
        var ctx = component.find("myChart").getElement();
        
        component.myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ["Burlington Textiles Corp of America", "Edge Communications", "Express Logistics and Transport", "GenePoint", "Yadav Info"],
                datasets: [{
                    label: '# of contacts',
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 99, 235, 0.2)',
                        'rgba(255, 206, 132, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 99, 130, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 99, 235, 0.2)',
                        'rgba(255, 206, 132, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 99, 130, 0.2)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    xAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                },
            }
        });
		
	},
    
    init: function(component, event, helper) {
        helper.getContactAndAccount(component, event, helper);
    }
})