public class PhaseController {
	 @AuraEnabled( cacheable = true )
    public static List<PMT_Phase__c> fetchPhases(String recordId) {
        return [SELECT Id, Project__c, Name,Phase_Health__c, Phase_Description__c FROM PMT_Phase__c WHERE Project__c =:recordId WITH SECURITY_ENFORCED];
    }
 
    @AuraEnabled
    public static string dmlOnPhases(Object data, String removePhaseIds) {
        List<PMT_Phase__c> updatePhase = (List<PMT_Phase__c>) JSON.deserialize(JSON.serialize(data), List<PMT_Phase__c>.class);
        List<PMT_Phase__c> deletePhase = new List<PMT_Phase__c>();
 
        if(String.isNotBlank(removePhaseIds)){
            List<Id> phaseIds = removePhaseIds.split(',');
            deletePhase = [SELECT Id FROM PMT_Phase__c WHERE Id IN :phaseIds];
        }
 
        try {
            if(updatePhase != null && !updatePhase.isEmpty()){
                upsert updatePhase;
            }
 
            if(deletePhase != null && !deletePhase.isEmpty()){    
                delete deletePhase;
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