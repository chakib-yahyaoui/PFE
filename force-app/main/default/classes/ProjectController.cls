public class ProjectController {
	@AuraEnabled(cacheable=true)
    public static Project__c getSingleProject() {
        return [
            SELECT Id, Name, Specifications__c, Date_begin__c, Date_end__c, Department__c,Members__c
            FROM Project__c
            WITH SECURITY_ENFORCED
            LIMIT 1
        ];
    }
    @AuraEnabled(cacheable=true)
    public static List<Project__c> getProjects(String depId) {
        return [
            SELECT Department__c, Id, Name, Specifications__c, Date_begin__c, Date_end__c
            FROM Project__c
            WHERE Department__c = :depId
            WITH SECURITY_ENFORCED
        ];
    }
    @AuraEnabled
    public static string updateProjects(Object data) {
    List<Project__c> projectsForUpdate = (List<Project__c>) JSON.deserialize(
         JSON.serialize(data),
         List<Project__c>.class
    );
    try {
        update projectsForUpdate;
        return 'Success: contacts updated successfully';
    }
    catch (Exception e) {
        return 'The following exception has occurred: ' + e.getMessage();
    }
}
}