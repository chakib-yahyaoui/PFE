public class accountListView {
	 @AuraEnabled(cacheable=True)
    public static List<Account> getAccounts(){
        return [SELECT Id, Name, Site, Phone
                FROM Account
                LIMIT 1000];
    }

    @AuraEnabled(cacheable=True)
    public static List<Account> searchAccount(String searchString){
        List<List<SObject>> accounts = [FIND :searchString IN ALL FIELDS RETURNING Account(Name, Site, Phone)];

        return (List<Account>) accounts[0];
    }

    @AuraEnabled
    public static void deleteAccounts(List<Id> accountIds){
        if(accountIds.size() > 0 ){
            delete [SELECT Id FROM Account WHERE Id in: accountIds];
        }
    }
}