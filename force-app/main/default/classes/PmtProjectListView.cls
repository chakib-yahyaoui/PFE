public class PmtProjectListView {
	@AuraEnabled(cacheable=True)
    public static List<inov8__PMT_Project__c> getPMTprojects(){
        return [SELECT Id, Name, inov8__Project_Status__c, 
                inov8__Health_Icon__c, inov8__Description__c,inov8__Percentage_Completion__c,inov8__Kickoff_formula__c,inov8__Deadline_formula__c
                FROM inov8__PMT_Project__c
                LIMIT 1000];
    }

    @AuraEnabled(cacheable=True)
    public static List<inov8__PMT_Project__c> searchPMTproject(String searchString){
        List<List<SObject>> projects = [FIND :searchString IN ALL FIELDS RETURNING inov8__PMT_Project__c(Name, inov8__Project_Status__c, 
                inov8__Health_Icon__c, inov8__Description__c,inov8__Percentage_Completion__c,inov8__Kickoff_formula__c,inov8__Deadline_formula__c)];

        return (List<inov8__PMT_Project__c>) projects[0];
    }

    @AuraEnabled
    public static void deletePMTprojects(List<Id> projectIds){
        if(projectIds.size() > 0 ){
            delete [SELECT Id FROM inov8__PMT_Project__c WHERE Id in: projectIds];
        }
    }
}