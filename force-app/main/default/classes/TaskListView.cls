public class TaskListView {
	@AuraEnabled(cacheable=True)
    public static List<PMT_Task__c> getTasks(){
        return [SELECT Id, Name, Start_Date__c, 
                Due_Date__c,Status__c
                FROM PMT_Task__c
                LIMIT 1000];
    }

    @AuraEnabled(cacheable=True)
    public static List<PMT_Task__c> searchTask(String searchString){
        List<List<SObject>> tasks = [FIND :searchString IN ALL FIELDS RETURNING PMT_Task__c(  Name, Start_Date__c, 
                Due_Date__c,Status__c)];

        return (List<PMT_Task__c>) tasks[0];
    }

    @AuraEnabled
    public static void deleteTasks(List<Id> taskIds){
        if(taskIds.size() > 0 ){
            delete [SELECT Id FROM PMT_Task__c WHERE Id in: taskIds];
        }
    }
}