public class LeadChartController {
	@AuraEnabled(cacheable = true)

    public static Map < String, Decimal > getLeadByStatus() {
        List < AggregateResult > result = [Select Count(Id) leadCount, Status st from Lead GROUP BY Status ];
        Map < String, Decimal > wrapp = new Map < String, Decimal > ();

        for (AggregateResult ar: result) {
            wrapp.put(String.valueOf(ar.get('st')), (Decimal) ar.get('leadCount'));

        }
        return wrapp;
    }
}