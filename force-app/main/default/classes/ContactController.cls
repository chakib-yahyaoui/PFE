public with sharing class ContactController {
   @AuraEnabled(cacheable=true)
    public static Contact getSingleContact() {
        return [
            SELECT Id, firstName, lastName, phone, Email
            FROM Contact
            WITH SECURITY_ENFORCED
            LIMIT 1
        ];
    }
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactList(String accId) {
        return [
            SELECT AccountId, Id, firstName, lastName, phone, Email
            FROM Contact
            WHERE AccountId = :accId
            WITH SECURITY_ENFORCED
        ];
    }
    @AuraEnabled
    public static string updateContacts(Object data) {
    List<Contact> contactsForUpdate = (List<Contact>) JSON.deserialize(
         JSON.serialize(data),
         List<Contact>.class
    );
    try {
        update contactsForUpdate;
        return 'Success: contacts updated successfully';
    }
    catch (Exception e) {
        return 'The following exception has occurred: ' + e.getMessage();
    }
}
    @AuraEnabled( cacheable = true )
    public static List<Contact> fetchContacts(String recordId) {
        return [SELECT Id, AccountId, FirstName, LastName, Email FROM Contact WHERE AccountId =:recordId LIMIT 100];
    }
 
    @AuraEnabled
    public static string dmlOnContacts(Object data, String removeContactIds) {
        List<Contact> updateContact = (List<Contact>) JSON.deserialize(JSON.serialize(data), List<Contact>.class);
        List<Contact> deleteContact = new List<Contact>();
 
        if(String.isNotBlank(removeContactIds)){
            List<Id> contactIds = removeContactIds.split(',');
            deleteContact = [SELECT Id FROM Contact WHERE Id IN :contactIds];
        }
 
        try {
            if(updateContact != null && !updateContact.isEmpty()){
                upsert updateContact;
            }
 
            if(deleteContact != null && !deleteContact.isEmpty()){    
                delete deleteContact;
            }
            return 'Success: Contact(s) upsert/delete successfully';
        }
        catch (Exception e) {
            String errorMsg = 'The following exception has occurred: ' + e.getMessage();
            throw new AuraHandledException(ErrorMsg);
        }
       // return '';
    }
}