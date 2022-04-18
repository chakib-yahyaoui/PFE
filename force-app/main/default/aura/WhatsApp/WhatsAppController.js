({
 doInit : function(component, event, helper) {
        var action = component.get("c.fetchContact");
         action.setParams({
            "conId" : component.get("v.recordId").toString()
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            var data;
            if(state === 'SUCCESS'){
                var result = response.getReturnValue();
                component.set("v.con", result);
            }
        });
        $A.enqueueAction(action);
 },
    sendWhatsApp : function(component, event, helper){
        var contact = component.get("v.con");
        var msg = 'Hello '+contact.Name+' '+component.find("myText").get("v.value");
        var url= "https://wa.me/216"+contact.MobilePhone+"?text="+msg;
        window.open(url, '_blank');
        $A.get("e.force:closeQuickAction").fire();
    }
    
})