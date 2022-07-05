public class opportinitiesListViewHelper {
	@AuraEnabled(cacheable=True)
    public static List<Opportunity> getOpportunities(){
        return [SELECT Id, Name, accountId, 
                account.name, Amount,CloseDate,StageName,Type
                FROM Opportunity
                LIMIT 1000];
    }

    @AuraEnabled(cacheable=True)
    public static List<Opportunity> searchOpportunity(String searchString){
        List<List<SObject>> opportunities = [FIND :searchString IN ALL FIELDS RETURNING Opportunity(Name, 
                account.name, Amount,CloseDate,StageName)];

        return (List<Opportunity>) opportunities[0];
    }

    @AuraEnabled
    public static void deleteOpportunities(List<Id> opportunityIds){
        if(opportunityIds.size() > 0 ){
            delete [SELECT Id FROM Opportunity WHERE Id in: opportunityIds];
        }
    }
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpportunitiesByName(String searchKey){
        String key = '%' + searchKey + '%';
        return [SELECT  Name, accountId,
                account.name, Amount,CloseDate,StageName,Type
                FROM Opportunity  where Name LIKE :key  WITH SECURITY_ENFORCED   ORDER BY Name];
    }
}