public class customPathStatusCtrl {
  
     @AuraEnabled
    public static Ticket__c stageNamePath(String recId){
        Ticket__c statusList = [Select Id, Name, Status__c From Ticket__c Where Id=:recId];
        system.debug('statusList ' + statusList);
        return statusList;
    }
}