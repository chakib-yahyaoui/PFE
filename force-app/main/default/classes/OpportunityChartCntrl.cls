public class OpportunityChartCntrl {
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpportunities(){
        return [SELECT Amount,Name,StageName FROM Opportunity WHERE CloseDate = LAST_MONTH  AND StageName = 'Closed Won'];
    }
}