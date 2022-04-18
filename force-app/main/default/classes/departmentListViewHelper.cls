public class departmentListViewHelper {
    @AuraEnabled(cacheable=True)
    public static List<Department__c> getDepartments(){
        return [SELECT Id, Name, Description__c
                FROM Department__c
                LIMIT 1000];
    }

    @AuraEnabled(cacheable=True)
    public static List<Department__c> searchDepartments(String searchString){
        List<List<SObject>> departments = [FIND :searchString IN ALL FIELDS RETURNING Department__c(Name, Description__c)];

        return (List<Department__c>) departments[0];
    }

    @AuraEnabled
    public static void deleteDepartments(List<Id> departmentIds){
        if(departmentIds.size() > 0 ){
            delete [SELECT Id FROM Department__c WHERE Id in: departmentIds];
        }
    }
}