public class AccountWrapper {
 
    @AuraEnabled(cacheable=true)
    public static List<AccountWrapperClass> fetchWrapperData(){
        List<AccountWrapperClass> wrapperList = new List<AccountWrapperClass>();
        for(Account acc : [SELECT Id, Name, billingStreet, billingCity, billingState, billingCountry, Type, (SELECT Id FROM Contacts) FROM Account WHERE Name != '' LIMIT 10]){
            wrapperList.add(new AccountWrapperClass(acc, acc.Contacts.SIZE()));
        }
        return wrapperList;
    }
 
    public class AccountWrapperClass{
        @AuraEnabled
        public Account acc;
        @AuraEnabled
        public Integer totalContact;
        @AuraEnabled
        public String billingAddress;
        @AuraEnabled
        public String accountLink;
        @AuraEnabled
        public String accountName;
        @AuraEnabled
        public String type;
 
 
        public AccountWrapperClass(Account acc, Integer totalContact){
            this.acc = acc;
            this.totalContact = totalContact;
            this.accountLink = '/' + acc.Id;
            this.accountName = acc.Name;
            this.type = acc.Type;
            this.billingAddress = acc.billingStreet + ',' + acc.billingCity + ',' + acc.billingState + ','+ acc.billingCountry;
        }
    }
}