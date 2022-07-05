public class WebServiceCntrl {
	 @AuraEnabled(cacheable=true)
    public static List<WebService_Log__c> getwebServiceList() {
        return [
            SELECT Name,WebService__c,EventDate__c, Error__c  
            FROM WebService_Log__c
            WITH SECURITY_ENFORCED
            ORDER BY  Name 
        ];
    }
    
    
    
    @AuraEnabled(cacheable=true)
    public static list <WebService_Log__c> getWebService(Id WebServiceId){
        return [ 
            SELECT Name,WebService__c,EventDate__c, Error__c  
            FROM WebService_Log__c
            WHERE Id=:WebServiceId 
            WITH SECURITY_ENFORCED
            ORDER BY Name
            ] ;
    }


   
    @AuraEnabled(cacheable=true)
    public static List<WebService_Log__c> SearchResult(String webServiceName){
        String keyString = '%'+webServiceName+'%';
        return [SELECT Name,WebService__c,EventDate__c, Error__c  
        FROM WebService_Log__c  WHERE Name like:keyString  WITH SECURITY_ENFORCED];
    }

   

    @AuraEnabled(cacheable=true)
    public static List<WebService_Log__c> getWebServiceByName(String searchKey){
        String key = '%' + searchKey + '%';
        return [SELECT Name,WebService__c,EventDate__c, Error__c  
        FROM WebService_Log__c WHERE Name LIKE :key  WITH SECURITY_ENFORCED   ORDER BY Name];
    }
}