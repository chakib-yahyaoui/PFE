public with sharing class orgController {
    @AuraEnabled(cacheable=true)
    public static List<Org__c> getorgList() {
        return [
            SELECT Name, Login__c	,Type__c,Url__c,Propritaire__c
            FROM Org__c
            WITH SECURITY_ENFORCED
        ];
    }
    @AuraEnabled(cacheable=true)
    public static List<User> getUserList() {
        return [
            SELECT Name
            FROM User
           where User.IsActive = true
            WITH SECURITY_ENFORCED
        ];
    }
    ////////////////// Department Update Method ///////////////////////
    @AuraEnabled
    public static Org__c updateOrg(Org__c org){
        Org__c organisation  = new Org__c() ;
        organisation = org;
        update organisation ;
        return organisation ;
    }
    @AuraEnabled(cacheable=true)
    public static list <Org__c> getOrg(Id OrgId){
        return [ 
            SELECT Name,Login__c,Type__c ,Url__c,Propritaire__c
            FROM Org__c
            WHERE Id=:OrgId 
            WITH SECURITY_ENFORCED
            ] ;
    }

@AuraEnabled
    public static Org__c createOrg(Object OrgRecObj){
        Map<String,Object> orginfo = (Map<String, Object>) JSON.deserializeUntyped(JSON.serialize(OrgRecObj));
        Org__c org = new Org__c() ;
       
        org.Name = String.valueOf(orginfo.get('Name'));
        org.Login__c = String.valueOf(orginfo.get('Login'));
        org.Type__c = String.valueOf(orginfo.get('type'));
        org.Propritaire__c = String.valueOf(orginfo.get('Prop')) ;       

        
            insert org;
            return org ;
    }

    @AuraEnabled(cacheable=true)
    public static list <Org__c> getName(Id OrgId){
        return [ 
            SELECT Name  
            FROM Org__c
            WHERE Id=:OrgId 
            WITH SECURITY_ENFORCED
            ] ;
    }

    @AuraEnabled(cacheable=true)
    public static List<Org__c> SearchResult(String orgName){
        String keyString = '%'+orgName+'%';
        return [SELECT Name, Login__c,Type__c FROM Org__c WHERE Name like:keyString];
    }

   

    @AuraEnabled(cacheable=true)
    public static List<Org__c> getOrgsByName(String searchKey){
        String key = '%' + searchKey + '%';
        return [select Name, Login__c,Type__c from Org__c where Name LIKE :key ];
    }

}