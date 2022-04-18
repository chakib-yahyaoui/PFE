public with sharing class refreshContactController {
   @AuraEnabled(cacheable=true)
    public static List<Contact> getContactList(){
        return [SELECT Id, firstName, lastName, accountId, 
                account.name, mailingStreet, mailingCity, mailingState, mailingPostalCode, mailingCountry, email 
                FROM Contact
                LIMIT 1000];
    }
}