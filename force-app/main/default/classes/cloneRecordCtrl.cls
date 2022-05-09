public with sharing class cloneRecordCtrl {
    @AuraEnabled
    public static void cloneRecord(){
        // retrive contact record for clone
        Contact con = [SELECT FirstName, Email, LastName FROM Contact LIMIT 1];
        // clone record
        Contact conCopy = con.clone(false, false, false, false);
        insert conCopy;
    }
}