({
	doInit : function(component, event, helper) {
		helper.doInitHelper(component, event, helper);
	},
    
    openCreateModal : function(component, event, helper) {
		helper.openCreateModalHelper(component, event, helper);
	},
    
    closeModal : function(component, event, helper) {
		component.set("v.openNewModal", false);
	},
    
    createNote : function(component, event, helper) {
		helper.createNoteHelper(component, event, helper);
	},
    
    markComplete : function(component, event, helper) {
		helper.markCompleteHelper(component, event, helper);
	},
})