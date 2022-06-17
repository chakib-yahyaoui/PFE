public with sharing class TicketController {
    @AuraEnabled(cacheable=true)
    public static List<Ticket__c> getticketList() {
        return [
            SELECT Name, N_Tickets__c	,Type__c,Priority__c , Status__c ,Project__c,Criticit__c
            FROM Ticket__c
            WITH SECURITY_ENFORCED
            ORDER BY  Name 
        ];
    }
    @AuraEnabled( cacheable = true )
    public static Integer getNumberTickets() {
        return [
            SELECT COUNT()   
            FROM Ticket__c];
   

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
    @AuraEnabled(cacheable=true)
    public static List<User> getChefdeprojet() {
        return [
            SELECT Name
            FROM User
           where User.Profileid =: 'Project Manager'
            WITH SECURITY_ENFORCED
        ];
    }
    
    ////////////////// Department Update Method ///////////////////////
    @AuraEnabled
    public static Ticket__c updateTicket(Ticket__c ticket){
        Ticket__c tickets  = new Ticket__c() ;
        tickets = ticket;
        update tickets ;
        return tickets ;}
    
    @AuraEnabled(cacheable=true)
    public static list <Ticket__c> getTicket(Id TicketId){
        return [ 
            SELECT Name, N_Tickets__c	,Type__c,Priority__c , Status__c , Project__c, Suivi_par__c,Send_from__c,Project_Manager__c,Criticit__c
            FROM Ticket__c
            WHERE Id=:TicketId 
            WITH SECURITY_ENFORCED
            ORDER BY Name
            ] ;
    }
    @AuraEnabled(cacheable=true)
    public static list <PMT_Project__c> getProjectList(){
        return [ 
            SELECT Id , Name
            FROM PMT_Project__c
            WHERE 	Project_Status__c!= 'Completed'
            WITH SECURITY_ENFORCED
            ] ;
    }
@AuraEnabled
    public static Ticket__c createTicket (Object ticketRecObj){
        Map<String,Object> ticketinfo = (Map<String, Object>) JSON.deserializeUntyped(JSON.serialize(ticketRecObj));
        Ticket__c ticket = new Ticket__c() ;
       
ticket.Name = String.valueOf(ticketinfo.get('Name'));
ticket.Type__c = String.valueOf(ticketinfo.get('Type'));
ticket.Priority__c = String.valueOf(ticketinfo.get('priority'));
ticket.Project__c=String.valueOf(ticketinfo.get('Project'));
ticket.Status__c = String.valueOf(ticketinfo.get('Statut'));
ticket.Send_from__c=String.valueOf(ticketinfo.get('send'));
ticket.Suivi_par__c=String.valueOf(ticketinfo.get('suivi'));
ticket.Type_de_la_demande__c= String.valueOf(ticketinfo.get('type'));
ticket.transmis__c=String.valueOf(ticketinfo.get('transmis'));
ticket.Criticit__c=String.valueOf(ticketinfo.get('Criticité'));
ticket.End_Date__c=Date.valueOf(ticketinfo.get('end'));



            Insert ticket;
            return ticket ;
    }
    @AuraEnabled
    public static Ticket__c createrelatedTicket (Object ticketRecObj){
        Map<String,Object> ticketinfo = (Map<String, Object>) JSON.deserializeUntyped(JSON.serialize(ticketRecObj));
        Ticket__c ticket = new Ticket__c() ;
        ticket.Name = String.valueOf(ticketinfo.get('Name'));
        insert ticket;
        return ticket ;}
    @AuraEnabled(cacheable=true)
    public static list <Ticket__c> getName(Id TicketId){
        return [ 
            SELECT Name  
            FROM Ticket__c
            WHERE Id=:TicketId 
            WITH SECURITY_ENFORCED
            ORDER BY Name] ;
    }
    @AuraEnabled(cacheable=true)
    public static List<Ticket__c> SearchResult(String ticketName){
        String keyString = '%'+ticketName+'%';
        return [ SELECT Name, N_Tickets__c	,Type__c,Priority__c , Status__c,Project__c,Criticit__c
FROM Ticket__c WHERE Name like:keyString  WITH SECURITY_ENFORCED];
    }

   

    @AuraEnabled(cacheable=true)
    public static List<Ticket__c> getTicketsByName(String searchKey){
        String key = '%' + searchKey + '%';
        return [SELECT Name, N_Tickets__c,Type__c,Priority__c ,Status__c, Criticit__c, Project__c FROM  Ticket__c where Name LIKE :key  WITH SECURITY_ENFORCED   ORDER BY Name];
    }
 
 
       }