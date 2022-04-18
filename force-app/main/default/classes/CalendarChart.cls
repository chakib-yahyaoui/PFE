public class CalendarChart {
    public List<String> CDate{get;set;}
    public List<Integer> CValue{get;set;}
    public List<Case> caseList{get;set;}
    
    public CalendarChart(){
        CDate = new List<String>();
        CValue = new List<Integer>();
        
        Integer dd;
        Integer month;
        Integer year;
        
        caseList = [SELECT ClosedDate,CaseNumber FROM Case];     
        for(Case c:caseList){
            dd = c.ClosedDate.day();
            month=c.ClosedDate.month();
            year = c.ClosedDate.year();
            CDate.add(year+'-'+month+'-'+dd);
            CValue.add(Integer.valueOf(c.CaseNumber));
        }
    }
}