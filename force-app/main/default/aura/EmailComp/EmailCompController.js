({
    loadComponent : function(component, event, helper) {
        helper.getSelctedAccountsOfOpportunity(component, event);
        helper.getEmailTempaltes(component, event);
        console.log(component.get("v.accIds"));
    }, 
    sendEmailAction : function(component, event, helper) {
        helper.sendEmails(component, event);
        
    },
    loadTemplate : function(component, event, helper) {
        helper.getTemplate(component, event);
        
    },
    closeDialog : function(component, event, helper)
    {
        helper.cancelAction(component, event);
    }
    
    
    
    
    
})