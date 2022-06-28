public class GEN_ChartController {
    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> getOpportunities(){
        return [SELECT SUM(ExpectedRevenue) expectRevenue, SUM(Amount) amount, StageName stage 
               FROM Opportunity WHERE IsClosed=false GROUP BY StageName LIMIT 200000];
    }
    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> getOpportunitiees(){
        return [SELECT COUNT(StageName) stage FROM Opportunity WHERE StageName='Closed Won'];
        
            
            
    }
    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> getOpportunities1(){
        return [SELECT COUNT(StageName) stage FROM Opportunity WHERE StageName='Lead detection & qualification'];
        
            
            
    }
    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> getOpportunities2(){
        return [SELECT COUNT(StageName) stage FROM Opportunity WHERE StageName='Value proposition'];
        
            
            
    }
    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> getOpportunities3(){
        return [SELECT COUNT(StageName) stage FROM Opportunity WHERE StageName='Business proposition'];
        
            
            
    }
    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> getOpportunities4(){
        return [SELECT COUNT(StageName) stage FROM Opportunity WHERE StageName='Negotiation'];
        
            
            
    }
    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> getOpportunities5(){
        return [SELECT COUNT(StageName) stage FROM Opportunity WHERE StageName='Contract Signature'];
        
            
            
    }
    @AuraEnabled( cacheable = true )
    public static Integer getOpportunitiesNumber() {
        return [
            SELECT COUNT()   
            FROM Opportunity];
   

            }
     @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpportunity(){
        return [SELECT Name,ExpectedRevenue, Amount, CloseDate
               FROM Opportunity WHERE StageName='Closed Won' LIMIT 200000];
    }
    
    
}