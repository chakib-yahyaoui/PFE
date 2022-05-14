public without sharing class ReusableCustomListViewController {
    @AuraEnabled( cacheable = true )  
    public static List <sObject> fetchRecs(String listValues) {
 
        List<String> strList = listValues.split( '-' );  
        system.debug( 'values are ' + strList );   
        String strObject = strList.get(0);
        String strFields = strList.get(1);
         
        List <sObject> listRecs = new List < sObject >();
        String strSOQL = 'SELECT Id, ' + strFields + ' FROM ' + strObject;
         
        strSOQL += ' LIMIT 25';
        system.debug( 'SOQL is ' + strSOQL );
        listRecs = Database.query( strSOQL );
        return listRecs;
    } 
}