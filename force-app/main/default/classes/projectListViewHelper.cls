public class projectListViewHelper {
	@AuraEnabled(cacheable=True)
    public static List<Project__c> getProjects(){
        return [SELECT Id, Name, Specifications__c, department__c ,
                Date_begin__c, Date_end__c
                FROM Project__c
                LIMIT 1000];
    }

    @AuraEnabled(cacheable=True)
    public static List<Project__c> searchProject(String searchString){
        List<List<SObject>> projects = [FIND :searchString IN ALL FIELDS RETURNING Project__c(Name, Specifications__c, department__c ,
                Date_begin__c, Date_end__c)];

        return (List<Project__c>) projects[0];
    }

    @AuraEnabled
    public static void deleteProjects(List<Id> projectIds){
        if(projectIds.size() > 0 ){
            delete [SELECT Id FROM Project__c WHERE Id in: projectIds];
        }
    }
}