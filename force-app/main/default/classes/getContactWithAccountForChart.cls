public class getContactWithAccountForChart {
    
    @auraEnabled
    public static list<contact> getContact() {
        list<contact> con = [SELECT id, name, account.name FROM contact];
        return con;
    }
}