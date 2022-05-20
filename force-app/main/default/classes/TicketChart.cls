public class TicketChart {
	  @AuraEnabled(cacheable=true)
    public static Map<String, Integer> aggregatTickets(){
        Map<String, Integer> ticketsTypeMap = new Map<String, Integer>();
        //Aggregate the opportunities. 
        for(AggregateResult aggr : [SELECT Count(Id), Type__c
                                    FROM Ticket__c
                                    GROUP BY Type__c]) {
            ticketsTypeMap.put((String)(aggr.get('Type__c')), (Integer)(aggr.get('expr0')));
        }

        return ticketsTypeMap;
    }
}