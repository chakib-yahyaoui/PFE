public class RefreshStandardComponentCtrl {
    @AuraEnabled
    public static string deleteContact(String recordId){
        Contact con = [SELECT Id FROM Contact WHERE AccountId =:recordId LIMIT 1];
        delete con;
        return 'Record Delete successfully!!';
    }
}