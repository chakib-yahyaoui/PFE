public with sharing class ticketController {
    @AuraEnabled(cacheable=true)
    public static List<Ticket__c> getticketList() {
        return [
            SELECT Name, N_Ticket__c	,Type__c,Priority__c , Status__c ,Project__c
            FROM Ticket__c
            WITH SECURITY_ENFORCED
            ORDER BY  Name 
        ];
    }
    @AuraEnabled(cacheable=true)
    public static List<User> getUserList() {
        return [
            SELECT Name
            FROM User
           where User.IsActive = true
            WITH SECURITY_ENFORCED
        ];
    }
    
    ////////////////// Department Update Method ///////////////////////
    @AuraEnabled
    public static Ticket__c updateTicket(Ticket__c ticket){
        Ticket__c tickets  = new Ticket__c() ;
        tickets = ticket;
        update tickets ;
        return tickets ;
    }
    @AuraEnabled(cacheable=true)
    public static list <Ticket__c> getTicket(Id TicketId){
        return [ 
            SELECT Name, N_Ticket__c	,Type__c,Priority__c , Status__c , Project__c, Suivi_par__c,Send_from__c,Project_Manager__c
            FROM Ticket__c
            WHERE Id=:TicketId 
            WITH SECURITY_ENFORCED
            ] ;
    }
    @AuraEnabled(cacheable=true)
    public static list <Project__c> getProjectList(){
        return [ 
            SELECT Id , Name
            FROM Project__c
            WITH SECURITY_ENFORCED
            ] ;
    }
@AuraEnabled
    public static Ticket__c createTicket (Object TicketRecObj){
        Map<String,Object> ticketinfo = (Map<String, Object>) JSON.deserializeUntyped(JSON.serialize(TicketRecObj));
        Ticket__c ticket = new Ticket__c() ;
       
        ticket.Name = String.valueOf(ticketinfo.get('Name'));
        ticket.N_Ticket__c = String.valueOf(ticketinfo.get('NTicket'));
        ticket.Type__c = String.valueOf(ticketinfo.get('Type'));
        ticket.Priority__c = String.valueOf(ticketinfo.get('priority'));
        ticket.Project__c=String.valueOf(ticketinfo.get('Project'));
        ticket.Status__c = String.valueOf(ticketinfo.get('Statut'));
ticket.Send_from__c=String.valueOf(ticketinfo.get('send'));
ticket.Suivi_par__c=String.valueOf(ticketinfo.get('suivi'));
ticket.Type_de_la_demande__c=String.valueOf(ticketinfo.get('type'));
ticket.transmis__c=String.valueOf(ticketinfo.get('transmis'));


            insert ticket;
            return ticket ;
    }
    @AuraEnabled
    public static Ticket__c createrelatedTicket (Object TicketRecObj){
        Map<String,Object> ticketinfo = (Map<String, Object>) JSON.deserializeUntyped(JSON.serialize(TicketRecObj));
        Ticket__c ticket = new Ticket__c() ;
        ticket.Name = String.valueOf(ticketinfo.get('Name'));
        ticket.N_Ticket__c = String.valueOf(ticketinfo.get('N_Ticket__c'));
        insert ticket;
        return ticket ;}
    @AuraEnabled(cacheable=true)
    public static list <Ticket__c> getName(Id TicketId){
        return [ 
            SELECT Name  
            FROM Ticket__c
            WHERE Id=:TicketId 
            WITH SECURITY_ENFORCED] ;
    }
    @AuraEnabled(cacheable=true)
    public static List<Ticket__c> SearchResult(String ticketName){
        String keyString = '%'+ticketName+'%';
        return [            SELECT Name, N_Ticket__c	,Type__c,Priority__c , Status__c,Project__c
FROM Ticket__c WHERE Name like:keyString];
    }

   

    @AuraEnabled(cacheable=true)
    public static List<Ticket__c> getTicketsByName(String searchKey){
        String key = '%' + searchKey + '%';
        return [SELECT Name, N_Ticket__c,Type__c,Priority__c ,Status__c , Project__c FROM  Ticket__c where Name LIKE :key ];
    }
 
     @AuraEnabled( cacheable = true )
       public static List<Ticket__c> fetchTickets(String recordId) {
           return [SELECT Id, Status__c, Name,N_Ticket__c, Priority__c FROM Ticket__c WHERE Id =:recordId LIMIT 100];
       }
    
       @AuraEnabled
       public static string dmlOnTickects(Object data, String removeTicketIds) {
           List<Ticket__c> updateTickect = (List<Ticket__c>) JSON.deserialize(JSON.serialize(data), List<Project__c>.class);
           List<Ticket__c> deleteTickect = new List<Ticket__c>();
    
           if(String.isNotBlank(removeTicketIds)){
               List<Id> ticketIds = removeTicketIds.split(',');
               deleteTickect = [SELECT Id FROM Ticket__c WHERE Id IN :ticketIds];
           }
    
           try {
               if(updateTickect != null && !updateTickect.isEmpty()){
                   upsert updateTickect;
               }
    
               if(deleteTickect != null && !deleteTickect.isEmpty()){    
                   delete deleteTickect;
               }
               return 'Success: Ticket updeted successfully';
           }
           catch (Exception e) {
               String errorMsg = 'The following exception has occurred: ' + e.getMessage();
               throw new AuraHandledException(ErrorMsg);
           }
          // return '';
       }
    
    
    
    
}