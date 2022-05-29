public class ColumnChart {
@AuraEnabled
    public static String getOppJSON(){
        
        List<Opportunity> lstopp = [SELECT Id, StageName FROM Opportunity];
        Map<String,Integer> mapLeadSource = new Map<String,Integer>();
        
        for(Opportunity l : lstopp)
        {
            if(mapLeadSource.containsKey(l.StageName))
            {
                mapLeadSource.put(l.StageName, mapLeadSource.get(l.StageName)+1) ;
            }else{
                mapLeadSource.put(l.StageName, 1) ;
            }
        }
        system.debug('map values--'+mapLeadSource);
        list<RadarDataWrapper> radarData = new list<RadarDataWrapper>();
        
        for(String key : mapLeadSource.keySet())
        {
            RadarDataWrapper rdw = new RadarDataWrapper();
            rdw.name=key;
            rdw.y=mapLeadSource.get(key);
            radarData.add(rdw);
        }
        system.debug('rdw---'+radarData);
        return System.json.serialize(radarData);
        //return null;
    }
    
    /**
* Wrapper class to serialize as JSON as return Value
* */
    class RadarDataWrapper
    {
        @AuraEnabled
        public String name;
        @AuraEnabled
        public integer y;
        
    }
}