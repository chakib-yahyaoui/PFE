public class DepartmentController {
	 @AuraEnabled( cacheable = true )
    public static List<Project__c> fetchProjects(String recordId) {
        return [SELECT Id, Department__c, Name,Specifications__c, Date_begin__c, Date_end__c FROM Project__c WHERE Department__c =:recordId LIMIT 100];
    }
 
    @AuraEnabled
    public static string dmlOnProjects(Object data, String removeProjectIds) {
        List<Project__c> updateProject = (List<Project__c>) JSON.deserialize(JSON.serialize(data), List<Project__c>.class);
        List<Project__c> deleteProject = new List<Project__c>();
 
        if(String.isNotBlank(removeProjectIds)){
            List<Id> projectIds = removeProjectIds.split(',');
            deleteProject = [SELECT Id FROM Project__c WHERE Id IN :projectIds];
        }
 
        try {
            if(updateProject != null && !updateProject.isEmpty()){
                upsert updateProject;
            }
 
            if(deleteProject != null && !deleteProject.isEmpty()){    
                delete deleteProject;
            }
            return 'Success: Department updeted successfully';
        }
        catch (Exception e) {
            String errorMsg = 'The following exception has occurred: ' + e.getMessage();
            throw new AuraHandledException(ErrorMsg);
        }
       // return '';
    }

}