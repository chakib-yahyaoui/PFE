public with sharing class lwcAppExampleApex {
 
    /*Using multiple parameter in apex  controller */
    @AuraEnabled
    public static Department__c submitDepartmentAction(string departmentName, string departmentDescription){
        Department__c DepartmentObj = new Department__c();
        DepartmentObj.Name=departmentName;
        DepartmentObj.Description__c=departmentDescription;
 
        insert DepartmentObj;
        return DepartmentObj;
    }
}