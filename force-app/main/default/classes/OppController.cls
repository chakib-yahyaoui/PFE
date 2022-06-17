public class OppController {
    public Account account {get; set;}
    public Opportunity opportunity {get; set;}
    public List<Opportunity> OppList {get; set;}
    
    
    public oppController(ApexPages.StandardController controller){
        
        this.opportunity = (Opportunity)controller.getRecord();
        
        
        this.OppList = [SELECT Name, Amount, CloseDate,StageName
                        FROM Opportunity
                        WHERE CloseDate < NEXT_MONTH AND CloseDate>LAST_MONTH 
                          ];
        
        
        
        
    }
    
   
}