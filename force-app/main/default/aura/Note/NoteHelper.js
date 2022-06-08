({
	doInitHelper : function(component, event, helper) {
		let action = component.get("c.fetchNotes");
        action.setCallback(this, function(response){
            
            let state = response.getState();
            if (state === "SUCCESS") {
                let lstNotes = response.getReturnValue();
                if(lstNotes){
                    let lstToDo = [];
                    let lstCompleted = [];
                    
                    for(let note of lstNotes){
                        if(note.Status__c == 'To Do'){
                            lstToDo.push(note);
                        }else if(note.Status__c == 'Completed'){
                            lstCompleted.push(note);
                        }
                    }
                    component.set("v.lstToDoNotes", lstToDo);
                    component.set("v.lstCompletedNotes", lstCompleted);
                    component.set("v.showCard", true);
                }
            }
        });
        $A.enqueueAction(action);
	},
    
    openCreateModalHelper : function(component, event, helper) {
		component.set("v.openNewModal", true);
	},
    
    createNoteHelper : function(component, event, helper) {
	let strTitle = component.get("v.strTitle");
        let action = component.get("c.createNoteRecord");
        action.setParams({
            "strTitle" : strTitle
        });
        action.setCallback(this, function(response){
            let state = response.getState();
            if (state === "SUCCESS") {
                let note = response.getReturnValue();
                let lstToDos = component.get("v.lstToDoNotes");
                lstToDos.push(note);
                component.set("v.lstToDoNotes",lstToDos);
                component.set("v.openNewModal", false);
            }
        });
        $A.enqueueAction(action);
	},
    
    markCompleteHelper : function(component, event, helper) {
        component.set("v.showCard", false);
		let selectedCheckbox = event.getSource();
        let recordId = selectedCheckbox.get("v.name");
        let action = component.get("c.completeTask");
        action.setParams({
            "recordId" : recordId
        });
        action.setCallback(this, function(response){
            let state = response.getState();
            if (state === "SUCCESS") {
                let boolSuccess = response.getReturnValue();
                if(boolSuccess){
                    let lstToDo = component.get("v.lstToDoNotes");
                    let lstCompleted = component.get("v.lstCompletedNotes");
                    for(let i in lstToDo){
                        if(lstToDo[i].Id == recordId){
                            lstCompleted.unshift(lstToDo[i]);
                            lstToDo.splice(i,1);
                        }
                    }
                    component.set("v.lstToDoNotes", lstToDo);
                	component.set("v.lstCompletedNotes", lstCompleted);
                    component.set("v.showCard", true);
                }
                
            }
        });
        $A.enqueueAction(action);
	},
})