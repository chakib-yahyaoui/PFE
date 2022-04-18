public class InvoicePDFController {
    public Account account {get; set;}
    public List<Opportunity> wonOppList {get; set;}
    public List<Opportunity> notWonOppList {get; set;}
    public List<Opportunity> lostOppList {get; set;}
    
    public invoicePDFController(ApexPages.StandardController controller){
        
        this.account = (Account)controller.getRecord();
        this.account = [SELECT Id, Name, BillingStreet, BillingCity, BillingState, 
                        	   BillingPostalCode, BillingCountry
                        FROM Account
                        WHERE Id = :account.Id
                       ];
        
        this.wonOppList = [SELECT Name, Amount, CloseDate
                           FROM Opportunity
                           WHERE AccountId = :this.account.Id 
                           AND StageName = 'Closed Won'                              
                          ];
        
        this.notWonOppList = [SELECT Name, Amount, StageName
                              FROM Opportunity
                              WHERE AccountId =:this.account.Id
                              AND StageName != 'Closed Won'
                              AND StageName != 'Closed Lost'
                              
                             ];
        this.lostOppList = [SELECT Name, Amount, StageName
                              FROM Opportunity
                              WHERE AccountId =:this.account.Id
                              AND StageName = 'Closed Lost'
                             ];
    }
    
   
}