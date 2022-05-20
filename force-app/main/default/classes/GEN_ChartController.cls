public class GEN_ChartController {
    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> getOpportunities(){
        return [SELECT SUM(ExpectedRevenue) expectRevenue, SUM(Amount) amount, StageName stage 
               FROM Opportunity WHERE StageName NOT IN ('Closed Won') GROUP BY StageName LIMIT 200000];
    }
    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> getOpportunitiees(){
        return [SELECT COUNT(StageName) stage FROM Opportunity WHERE StageName='Closed Won'];
        
            
            
    }
     @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpportunity(){
        return [SELECT Name,ExpectedRevenue, Amount, CloseDate
               FROM Opportunity WHERE StageName='Closed Won' LIMIT 200000];
    }
    
    
}