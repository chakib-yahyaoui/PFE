({
    doInit : function(component, event, helper) {        		
       helper.getStatusHelper(component, event, helper);       
	},
    
	statusPicklistSelect : function (component, event, helper) {
        var status = event.getParam("detail").value;
        alert('Status__c ' + status);
        component.set("v.PicklistField.Status__c", status);
        
        component.find("record").saveRecord($A.getCallback(function(response) {
            if (response.state === "SUCCESS") {
                $A.get('e.force:refreshView').fire();
            }
        }));
    },
    
})