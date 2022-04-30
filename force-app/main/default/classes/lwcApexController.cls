public with sharing class lwcApexController {
      
    //custom lookup lwc
@AuraEnabled(cacheable=true)
public static List<Account> getCustomLookupAccount (String actName){
   List<Account> accLookupList =  new List<Account>();
   if(actName != ''){
       String accountName = '%' + actName + '%';
       accLookupList = [Select Id, Name From Account Where Name like:accountName];
       return accLookupList;
   }
   return accLookupList;
}   
    @AuraEnabled(cacheable=true)
public static List<User> getCustomLookupUser (String depName){
   List<User> userLookupList =  new List<User>();
   if(depName != ''){
       String userName = '%' + depName + '%';
       userLookupList = [SELECT Name
            FROM User
           where User.IsActive = true
            WITH SECURITY_ENFORCED];
       return userLookupList;
   }
   return userLookupList;
} 
 
}