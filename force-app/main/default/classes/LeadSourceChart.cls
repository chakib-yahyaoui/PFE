public class LeadSourceChart {
	@AuraEnabled

    public static String getLeadJSON(){

         

        List<Lead> lstLead = [SELECT Id, LeadSource FROM Lead limit 100 ];

        Map<String,Integer> mapLeadSource = new Map<String,Integer>();

         

        for(Lead l : lstLead)

        {

            if(mapLeadSource.containsKey(l.LeadSource))

            {

                mapLeadSource.put(l.LeadSource, mapLeadSource.get(l.LeadSource) + 1 ) ;

            }else{

                mapLeadSource.put(l.LeadSource, 1) ;       

            }

        }

         

        RadarDataWrapper radarData = new RadarDataWrapper();

        for(String key : mapLeadSource.keySet())

        {

            radarData.radarLabels.add(key);

            radarData.radarData.add(mapLeadSource.get(key));

        }

         

        return System.json.serialize(radarData);

    }

    /**

     * Wrapper class to serialize as JSON as return Value

     * */
    class RadarDataWrapper

    {

       public List<String> radarLabels {get;set;}

       public List<Integer> radarData {get;set;}

        public RadarDataWrapper(){

            radarLabels = new List<String>();

            radarData = new List<Integer>();

        }

    }

     

}