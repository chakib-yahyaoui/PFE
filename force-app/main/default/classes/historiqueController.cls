public with sharing class historiqueController {
    @AuraEnabled(cacheable=true)
    public static list <Org__c> gethistory(Id OrgId){
        return [ 
            SELECT Name,Login__c,Propritaire__c	,Url__c ,Password__c,Secret_Word__c,Backup_Manager__c, CreatedById ,Email_a_prevenir__c,Noms_de_domaine__c,SSO_Contact__c,SSO_Server__c,Token__c,Type__c,Version__c
            FROM Org__c
            WHERE Id=:OrgId 
            WITH SECURITY_ENFORCED
            ] ;
    }
}