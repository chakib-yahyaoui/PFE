public  with sharing class MyOrgHistoryViewController {
 public List<Org__History> histories {get; set;}
    
 
    public MyOrgHistoryViewController() {
        this.histories = this.getOrgHistories();
    }
    
    private List<Org__History> getOrgHistories() {
        return [
            SELECT
                 CreatedById
                ,CreatedDate
                ,Field
                ,Id
                ,IsDeleted
                ,NewValue
                ,OldValue
                ,ParentId
            FROM
               Org__History
            ORDER BY CreatedDate DESC
            LIMIT 200
        ];
    }
}