public with sharing class OpportunityDataService {

    @AuraEnabled(cacheable=true)
    public static Map<String, Integer> aggregateOpportunities(String accountId){
        Map<String, Integer> opportunityStatusMap = new Map<String, Integer>();
        //Aggregate the opportunities. 
        for(AggregateResult aggr : [SELECT Count(Id), StageName
                                    FROM Opportunity
                                    WHERE AccountId=:accountId
                                    GROUP BY StageName]) {
            opportunityStatusMap.put((String)(aggr.get('StageName')), (Integer)(aggr.get('expr0')));
        }

        return opportunityStatusMap;
    }
        @AuraEnabled(cacheable=true)
    public static Map<String, Integer> aggregateOpportunitiees(){
        Map<String, Integer> opportunityStatusMap = new Map<String, Integer>();
        //Aggregate the opportunities. 
        for(AggregateResult aggr : [SELECT Count(Id), StageName
                                    FROM Opportunity
                                    GROUP BY StageName]) {
            opportunityStatusMap.put((String)(aggr.get('StageName')), (Integer)(aggr.get('expr0')));
        }

        return opportunityStatusMap;
    }
}