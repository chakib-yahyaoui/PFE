public class LeadChart {
	@AuraEnabled
    public static String getLeadJSON(){
        
       List<lead> lstopp = [SELECT Id, 	Status FROM lead ];
        Map<String,Integer> mapLeadSource = new Map<String,Integer>();
        
        for(lead l : lstopp)
        {
            if(mapLeadSource.containsKey(l.Status))
            {
                mapLeadSource.put(l.Status, mapLeadSource.get(l.Status)+1) ;
            }else{
                mapLeadSource.put(l.Status, 1) ;        
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