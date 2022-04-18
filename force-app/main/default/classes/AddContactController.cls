public class AddContactController {
public Contact con{get;set;}
    public Lead le;
    public Boolean success {get;set;}
    public Boolean saved{get;set;}
    public String accId{get;set;}
    public List<Contact> conList {get;set;}
    public List<Contact> conListDelete;
    public String FirstName{get;set;}
    public String LastName{get;set;}
    public String MobilePhone{get;set;}
    public Integer selectedRowIndex{get;set;}
    
   
    public addContactController(ApexPages.StandardController controller){
        //Get Account ID from URL
        accId=ApexPages.currentPage().getParameters().get('Id');
        conListDelete = new List<Contact>();
        conList = [SELECT Id, FirstName, LastName, MobilePhone FROM Contact where AccountId=:accId];
        if(conList==null){
            conList = new List<Contact>();
        }
        
        
    }
    
    public PageReference save(){
      Boolean goodToGo = true;
        PageReference reRend = new PageReference('/lightning/r/Account/'+accId+'/view');
        if(conList != null && conList.size()>0){
            for(Contact newCon:conList){
                if(newCon.FirstName == null || newCon.LastName == null || newCon.MobilePhone == null){
                    goodToGo = false;
                    ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.FATAL,'Please enter required fields'));
                }
            }
            if(goodToGo == true){
                upsert conList;
                if(conListDelete != null && conListDelete.size()>0){
                    delete conListDelete;
                }
                return reRend;
            }
            else{
                return null;
            }
        }
        else{
            if(conListDelete != null && conListDelete.size()>0){
                delete conListDelete;
            }
            return reRend;
        }
       
    }
    public void cancel(){
        
    }
    
    public void addCon(){
        Contact newCon = new Contact();
        newCon.FirstName = FirstName;
        newCon.LastName = LastName;
        newCon.MobilePhone = MobilePhone;
        newCon.AccountId = accId;
        conList.add(newCon);
        FirstName='';
        LastName = '';
        MobilePhone='';
        
    }
    public void removeCon(){
        conListDelete.add(conList[selectedRowIndex]);
        conList.remove(selectedRowIndex);
    }
    
}