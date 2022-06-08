public class ListEmaillOppController
{
    private ApexPages.StandardSetController standardSetController;
    public string accIdStr{get;set;}
    public string oppIdStr{get;set;}
    public ListEmaillOppController(ApexPages.StandardSetController standardSetController)
    {
        this.standardSetController = standardSetController;
        accIdStr='';
    }
 
    public PageReference doSomething()
    {
        // Apex code for handling records from a List View goes here
        List<Opportunity> selectedListViewRecords =
            (List<Opportunity>) standardSetController.getSelected();
            
        Boolean hasMore = standardSetController.getHasNext();
        if(selectedListViewRecords.size()>0){
            list<string> accIds = new list<string>();
            list<string> oppIds = new list<string>();
            for(Opportunity oppRec : [select id,accountId from Opportunity WHERE Id IN: selectedListViewRecords]){
                accIds.add(oppRec.accountId);
                 oppIds.add(oppRec.Id);
            }
            accIdStr = accIds.size()>0 ? String.join(accIds, ',') : '';
            oppIdStr= oppIds.size()>0 ? String.join(oppIds, ',') : '';
        }
        
        
        
        system.debug('---selectedListViewRecords ---'+selectedListViewRecords.size() );
        return null;
    }
}