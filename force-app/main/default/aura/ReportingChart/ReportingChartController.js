({
    doInit : function(component, event, helper) {
        let action = component.get("c.fetchReportChartSettings");
        action.setCallback(this,function(response){
            let state = response.getState();
            if(state == 'SUCCESS'){
                let result = response.getReturnValue();
                console.log('Result: ' +result);
                if(result.RPTChart__Report_Name__c!=null && result.RPTChart__Report_Name__c!=''){
                    component.set("v.selectedReport",result.RPTChart__Report_Name__c);
                }
                if(result.RPTChart__Chart_Type__c!=null && result.RPTChart__Chart_Type__c!=''){
                    component.set("v.selectedChartType",result.RPTChart__Chart_Type__c);
                }
                helper.getReports(component,event,helper);
            }
            else{
                if(response.getReturnValue()==null){
                    helper.getReports(component,event,helper);
                }
                console.log('Something went wrong! ');
            }
        });
        $A.enqueueAction(action);
    },
    onSelectReportChange : function(component, event, helper) {
        component.set("v.isChartReady",true);
        component.set("v.selectedReport",event.getSource().get("v.value"));
        helper.CreateChart(component);
        helper.updateSettings(component,event,helper);
    },
    onSelectChartTypeChange : function(component, event, helper) {
        component.set("v.isChartReady",true);
        component.set("v.selectedChartType",event.getSource().get("v.value"));
        helper.CreateChart(component);
        helper.updateSettings(component,event,helper);
    },
    showSpinner: function(component, event, helper) {
        // make Spinner attribute true for display loading spinner 
        component.set("v.Spinner", true); 
    },
    // this function automatic call by aura:doneWaiting event 
    hideSpinner : function(component,event,helper){
        // make Spinner attribute to false for hide loading spinner    
        component.set("v.Spinner", false);
    }
    
})