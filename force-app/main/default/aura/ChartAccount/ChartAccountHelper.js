({
	getContactAndAccount : function(component, event, helper) {
		var action = component.get("c.getContact");
        
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state === "SUCCESS") {
                var contacts = response.getReturnValue();
                
                //go to next helper function to assign value to chart
                this.setData(component, event, contacts);
            }
        });
        
        $A.enqueueAction(action);
	},
    
    setData : function(component, event, contacts) {
        if (component.myChart && component.myChart.data && component.myChart.data.datasets[0]) {
            var contacts = contacts;
            
            if (contacts && Array.isArray(contacts)) {
                var map = {};
                
                contacts.forEach(function(contacts) {
                    map[contacts.Account.Name.replace(/ /g, '_')] = (map[contacts.Account.Name.replace(/ /g, '_')] || 0) +1;                })
                	//since in map we can't use name with space separated, so we replace the space with '_'
                	
                var data = [
                    map.Burlington_Textiles_Corp_of_America || 0,
                    map.Edge_Communications || 0,
                    map.Express_Logistics_and_Transport || 0,
                    map.GenePoint || 0,
                    map.Yadav_Info || 0
                ];
                //in this example I am putting the account name which I needed to show, If we want we can show all account or can make them dinamically to be came
                
                component.myChart.data.datasets[0].data = data;
                component.myChart.update();
            }
        }
    }
})