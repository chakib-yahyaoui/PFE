public with sharing class ticketController {
    @AuraEnabled(cacheable=true)
    public static List<Ticket__c> getticketList() {
        return [
            SELECT Name, N_Ticket__c	,Type__c,Priority__c
            FROM Ticket__c
            WITH SECURITY_ENFORCED
        ];
    }
    
    ////////////////// Department Update Method ///////////////////////
    @AuraEnabled
    public static Ticket__c updateTicket(Ticket__c tick){
        Ticket__c ticket  = new Ticket__c() ;
        ticket = tick;
        update ticket ;
        return ticket ;
    }
    @AuraEnabled(cacheable=true)
    public static list <Ticket__c> getTicket(Id TicketId){
        return [ 
            SELECT Name, N_Ticket__c	,Type__c,Priority__c
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
        ticket.Priority__c = String.valueOf(ticketinfo.get('Criti'));


            insert ticket;
            return ticket ;
    }

    @AuraEnabled(cacheable=true)
    public static list <Ticket__c> getName(Id TicketId){
        return [ 
            SELECT Name  
            FROM Ticket__c
            WHERE Id=:TicketId 
            WITH SECURITY_ENFORCED
            ] ;
    }

    @AuraEnabled(cacheable=true)
    public static List<Ticket__c> SearchResult(String ticketName){
        String keyString = '%'+ticketName+'%';
        return [            SELECT Name, N_Ticket__c	,Type__c,Priority__c
FROM Ticket__c WHERE Name like:keyString];
    }

   

    @AuraEnabled(cacheable=true)
    public static List<Ticket__c> getTicketsByName(String searchKey){
        String key = '%' + searchKey + '%';
        return [SELECT Name, N_Ticket__c,Type__c,Priority__c FROM  Ticket__c where Name LIKE :key ];
    }

}