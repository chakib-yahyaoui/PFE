public class opportinitiesListViewHelper {
	@AuraEnabled(cacheable=True)
    public static List<Opportunity> getOpportunities(){
        return [SELECT Id, Name, accountId, 
                account.name, Amount,CloseDate,StageName,Type
                FROM Opportunity
                LIMIT 1000];
    }

    @AuraEnabled(cacheable=True)
    public static List<Contact> searchOpportunity(String searchString){
        List<List<SObject>> opportunities = [FIND :searchString IN ALL FIELDS RETURNING Opportunity(Name, 
                account.name, Amount,CloseDate,StageName)];

        return (List<Contact>) opportunities[0];
    }

    @AuraEnabled
    public static void deleteOpportunities(List<Id> opportunityIds){
        if(opportunityIds.size() > 0 ){
            delete [SELECT Id FROM Opportunity WHERE Id in: opportunityIds];
        }
    }
}