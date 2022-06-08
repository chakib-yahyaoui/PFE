({
    getEmailTempaltes : function(component, event) {
        var action = component.get("c.getTemplates");
        //action.setParams({"divisionId":selectedDivision});
        
        action.setCallback(this,function(response){
            var loadResponse = response.getReturnValue();
            console.log('templates..!',loadResponse);
            
            if(!$A.util.isEmpty(loadResponse)){
                
                component.set('v.templates',loadResponse);
                
            }
        });
        $A.enqueueAction(action);
    },
    getSelctedAccountsOfOpportunity : function(component, event) {
        
        var accIdsofOpp = component.get("v.accIds");
        
        if(!$A.util.isEmpty(accIdsofOpp)){
            
            var action = component.get("c.getAccountsOfOpportunity");
            action.setParams({"accIds":accIdsofOpp});
            
            action.setCallback(this,function(response){
                var responseVal = response.getReturnValue();
                console.log('responseVal..** ',responseVal);
                
                if(!$A.util.isEmpty(responseVal)){
                    
                    component.set("v.accRecords",responseVal);
                    
                }
            });
            $A.enqueueAction(action);
        }
        
    },
    sendEmails : function(component, event) {
        component.set("v.shoMsg", false);
        component.set("v.showLoader", true);
        var selRec = component.find("lookupRes").get("v.lstSelectedRecords");
        var templateId = component.get("v.selTempl");
        var oppRecIds = component.get("v.oppIds");
        console.log('oppRecIds ', oppRecIds);
        console.log('sel records ', selRec);
        console.log('sel template ', templateId);
        
        //var addnlEmails = document.getElementById("addnlEmail").value;
        
        var subjMatter = document.getElementById("subjMatter").value;
        console.log('subjMatter ',subjMatter);
        var emailBody = !$A.util.isEmpty(component.get("v.Opportunity").SampleRichText__c) ? component.get("v.Opportunity").SampleRichText__c : '';
        console.log('emailBody ',emailBody);
        
        if(!$A.util.isEmpty(selRec) && (!$A.util.isEmpty(emailBody) || !$A.util.isEmpty(templateId)) ){
            
            var accIds = [];
            for (var i = 0; i<selRec.length; i++) {
                accIds.push(selRec[i].PersonContactId);
            }
            console.log('---accIds--- ', accIds);
            var accIdStr = !$A.util.isEmpty(accIds) ? accIds.join() : '';
            console.log('---accIdStr--- ', accIdStr);
            
            if(!$A.util.isEmpty(accIdStr) || !$A.util.isEmpty(addnlEmails)){
                
                console.log('---accIdStr--- ', accIdStr);
                console.log('--Opportunity--', component.get("v.Opportunity"));
                
                var action = component.get("c.sendAnEmailMsg");
                action.setParams({"templateId":templateId,
                                  "accIds":!$A.util.isEmpty(accIdStr) ? accIdStr : '',
                                  "opty":component.get("v.Opportunity"),
                                  "subj" : !$A.util.isEmpty(subjMatter) ? subjMatter : '',
                                  "addnlEmails" : '',
                                  "oppIds" : oppRecIds });
                
                action.setCallback(this,function(response){
                    
                    var emailMsgResp = response.getReturnValue();
                    console.log('--emailMsgResp--', emailMsgResp); //isSuccess  errMsg
                    component.set("v.showLoader", false);
                    
                    if(emailMsgResp.isSuccess){
                        component.set("v.shwSucesMsg", true);
                        this.cancelAction(component, event);
                    }
                    else {
                        component.set("v.shoMsg", true);
                        component.set("v.errorMsg", emailMsgResp.errMsg);
                    }
                    
                });
                $A.enqueueAction(action);
            }
            
            
            
        }
        else {
            component.set("v.showLoader", false);
            component.set("v.shoMsg", true);
            component.set("v.errorMsg", "Please provide Recipient, Template or Email Body");
        }
        
    },
    getTemplate : function(component, event) {
        
        var templId = component.get("v.selTempl");
        component.set("v.showLoader", true);
        if(!$A.util.isEmpty(templId)){
            
            var action = component.get("c.getTemplateDetails");
            action.setParams({"templteId":templId});
            
            action.setCallback(this,function(response){
                component.set("v.showLoader", false);
                var responseVal = response.getReturnValue();
                console.log('responseVal..@getTemplate ',responseVal);
                
                if(!$A.util.isEmpty(responseVal)){
                    
                    component.set("v.templDetail",responseVal);
                    component.set("v.subjTxt",responseVal.Subject);
                    if(!$A.util.hasClass(component.find("emailBodyDiv"), "slds-hide")){
                        
                        $A.util.addClass(component.find("emailBodyDiv"), 'slds-hide'); 
                    }
                    
                }
            });
            $A.enqueueAction(action);
        }
        else {
            component.set("v.showLoader", false);
            if($A.util.hasClass(component.find("emailBodyDiv"), "slds-hide")){
                
                $A.util.removeClass(component.find("emailBodyDiv"), 'slds-hide');
            }
        }
    },
    cancelAction: function(component, event){
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": '/006/o'
        });
        urlEvent.fire()
    }
    
})