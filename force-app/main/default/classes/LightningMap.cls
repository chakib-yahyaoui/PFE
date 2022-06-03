public class LightningMap {
	@AuraEnabled
    public static  List<Account> fetchAllAccounts(){
        List<Account> accList = [Select Id,Name,Website,BillingCity,BillingStreet,BillingPostalCode,BillingState,BillingCountry from Account ];
        return accList;
    }
}