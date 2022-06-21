public class PmtProjectListView {
	@AuraEnabled(cacheable=True)
    public static List<PMT_Project__c> getPMTprojects(){
        return [SELECT Id, Name, Project_Status__c, 
                Health_Icon__c, Description__c,Percentage_Completion__c,Kickoff_formula__c,Deadline_formula__c
                FROM PMT_Project__c
                LIMIT 1000];
    }

    @AuraEnabled(cacheable=True)
    public static List<PMT_Project__c> searchPMTproject(String searchString){
        List<List<SObject>> projects = [FIND :searchString IN ALL FIELDS RETURNING PMT_Project__c( Name, Project_Status__c, 
                Health_Icon__c, Description__c,Percentage_Completion__c,Kickoff_formula__c,Deadline_formula__c)];

        return (List<PMT_Project__c>) projects[0];
    }

    @AuraEnabled
    public static void deletePMTprojects(List<Id> projectIds){
        if(projectIds.size() > 0 ){
            delete [SELECT Id FROM PMT_Project__c WHERE Id in: projectIds];
        }
    }
}