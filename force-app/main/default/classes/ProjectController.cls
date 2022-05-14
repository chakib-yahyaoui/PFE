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
    public static List<Ticket__c> getTickets(String prjId) {
        return [
            SELECT Project__c, Id, Name,N_Ticket__c,Priority__c, Description__c, date_debut__c, 	End_Date__c
            FROM Ticket__c
            WHERE Project__c = :prjId
            WITH SECURITY_ENFORCED
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
    @AuraEnabled
    public static string updateTickets(Object data) {
    List<Ticket__c> ticketsForUpdate = (List<Ticket__c>) JSON.deserialize(
         JSON.serialize(data),
         List<Ticket__c>.class
    );
    try {
        update ticketsForUpdate;
        return 'Success: contacts updated successfully';
    }
    catch (Exception e) {
        return 'The following exception has occurred: ' + e.getMessage();
    }
}
    @AuraEnabled( cacheable = true )
    public static List<Ticket__c> fetchTickets(String recordId) {
        return [SELECT Id, Project__c, Name,Description__c, N_Ticket__c, date_debut__c,End_Date__c FROM Ticket__c WHERE Project__c =:recordId LIMIT 100];
    }
 
    @AuraEnabled
    public static string dmlOnTickets(Object data, String removeTicketIds) {
        List<Ticket__c> updateTicket = (List<Ticket__c>) JSON.deserialize(JSON.serialize(data), List<Ticket__c>.class);
        List<Ticket__c> deleteTicket = new List<Ticket__c>();
 
        if(String.isNotBlank(removeTicketIds)){
            List<Id> ticketIds = removeTicketIds.split(',');
            deleteTicket = [SELECT Id FROM Ticket__c WHERE Id IN :ticketIds];
        }
 
        try {
            if(updateTicket != null && !updateTicket.isEmpty()){
                upsert updateTicket;
            }
 
            if(deleteTicket != null && !deleteTicket.isEmpty()){    
                delete deleteTicket;
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