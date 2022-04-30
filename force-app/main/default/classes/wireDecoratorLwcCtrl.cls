public with sharing class wireDecoratorLwcCtrl {    
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> allOppRecords(){
        List<Opportunity> oppList = [SELECT Id, Name, Amount, AccountId, Account.Name, CloseDate, Description, StageName FROM Opportunity];
        return oppList;
    }
}