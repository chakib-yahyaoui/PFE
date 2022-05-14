public class SearchRecordsController {
    @AuraEnabled
    public static String getUIThemeDescription() {
        String theme = UserInfo.getUiThemeDisplayed();
        return theme;
    }
     
    //Get Account Records
    @AuraEnabled
    public static wResult getAccounts(String pageSize, String pageNumber, string searchText, string sortDirection,string sortBy, string searchType){
        List<WAccount> wAccList = new List<WAccount>();
        String searchKey = searchText+ '%';
 
        String query = 'SELECT Id, Name, BillingAddress, BillingStreet, BillingCity, BillingState, BillingCountry, BillingPostalCode, RecordType.Name, AccountNumber, type, Owner.Name, Owner.phone, Phone FROM Account where Name != null ';
        if (String.isNotBlank(searchText)) {
            if(searchType == 'Name'){
                query += ' and (name like: searchKey)';
            } else if(searchType == 'Phone'){
                query += ' and (Phone LIKE: searchKey)';
            } else if(searchType == 'Number'){
                query += ' and (AccountNumber like: searchKey)';
            }
        }
 
        query += ' limit 1000';
        List<Account> lacc =  Database.query(query);
        for(Account a: lacc){
            wAccList.add(new WAccount(a));
        }
        return new wResult(lacc.size(),wAccList);
    }
 
    //Get Account Records LWC
    @AuraEnabled
    public static wResult getAccountsLWC(string searchText, string searchType){
        List<WAccount> wAccList = new List<WAccount>();
        String searchKey = searchText+ '%';
 
        String query = 'SELECT Id, Name, BillingAddress, BillingStreet, BillingCity, BillingState, BillingCountry, BillingPostalCode, RecordType.Name, AccountNumber, type, Owner.Name, Owner.phone, Phone FROM Account WHERE Name != null';
        if (String.isNotBlank(searchText)) {
            if(searchType == 'Name'){
                query += ' and (name like: searchKey)';
            } else if(searchType == 'Phone'){
                query += ' and (Phone LIKE: searchKey)';
            } else if(searchType == 'Number'){
                query += ' and (AccountNumber like: searchKey)';
            }
        }
        query += ' limit 1000';
 
        List<Account> lacc =  Database.query(query);
        for(Account a: lacc){
            wAccList.add(new WAccount(a));
        }
        return new wResult(lacc.size(),wAccList);
    }
     
    public class wResult{
        @AuraEnabled public Integer totalAccount;
        @AuraEnabled public List<WAccount> lstAccounts;
        public wResult(Integer totalAccount, List<WAccount> lstAccounts){
            this.totalAccount = totalAccount;
            this.lstAccounts = lstAccounts;
        }
    }
    public class WAccount{      
        @AuraEnabled public string Name;
        @AuraEnabled public string Type;
        @AuraEnabled public string Phone;
        @AuraEnabled public string OwnerName;
        @AuraEnabled public string OwnerId;
        @AuraEnabled public string OwnerPhone;
        @AuraEnabled public string AccountNumber;
        @AuraEnabled public string BillingAddress;
        @AuraEnabled public string BillingState;
        public string makeAddress(Account Acc){
            string address = '';
            if(Acc.BillingAddress != null){
                address = acc.BillingStreet+', '+acc.BillingCity+', '+acc.BillingState+', '+acc.BillingCountry+', '+acc.BillingPostalCode;
                address = address.replace('null','');address = address.replace(', , ',',');
                address = address.replace(', , ',',');
                address = address.replace(',, ','');
            }
            return address;
        }
        public WAccount(Account acc){
            this.name = (acc.name <> null) ? acc.name : '';
            this.Type = (acc.Type <> null) ? acc.Type : '';
            this.OwnerName = (acc.Owner.Name <> null) ? acc.Owner.Name : '';
            this.OwnerId = acc.Owner.Id;
            this.OwnerPhone = (acc.Owner.Phone <> null) ? acc.Owner.Phone : '';
            this.Phone = acc.phone;                 
            this.BillingAddress = makeAddress(acc);
            this.AccountNumber = (this.AccountNumber <> null) ? this.AccountNumber : '';
            this.Phone = (this.Phone <> null) ? this.Phone : '';
            this.BillingState = (acc.BillingState <> null) ? acc.BillingState : '';
        }
    }
}