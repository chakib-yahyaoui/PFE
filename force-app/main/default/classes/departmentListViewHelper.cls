public class departmentListViewHelper {
    @AuraEnabled(cacheable=True)
    public static List<Department__c> getDepartments(){
        return [SELECT Id, Name, Description__c,Member__c,	Manager__c,Project_Managers__c
                FROM Department__c
                WITH SECURITY_ENFORCED];
    }
    @AuraEnabled(cacheable=True)
    public static List<Department__c> searchDepartment(String searchString){
        List<List<SObject>> departments = [FIND :searchString IN ALL FIELDS RETURNING Department__c(Name, Description__c)];

        return (List<Department__c>) departments[0];
    }
    @AuraEnabled(cacheable=true)
    public static List<User> getUserList() {
        return [
            SELECT Name
            FROM User
           where User.IsActive = true
            WITH SECURITY_ENFORCED
        ];
    }


    @AuraEnabled
    public static void deleteDepartments(List<Id> departmentIds){
        if(departmentIds.size() > 0 ){
            delete [SELECT Id FROM Department__c WHERE Id in: departmentIds];
        }
    }
    @AuraEnabled
    public static Department__c updateDepartment(Department__c dep){
        Department__c department  = new Department__c() ;
        department = dep;
        update department ;
        return department ;
    }
    @AuraEnabled
    public static Department__c createDepartment (Object DepartmentRecObj){
        Map<String,Object> departmentinfo = (Map<String, Object>) JSON.deserializeUntyped(JSON.serialize(DepartmentRecObj));
        Department__c department = new Department__c() ;
       
        department.Name = String.valueOf(departmentinfo.get('Name'));
        department.Description__c = String.valueOf(departmentinfo.get('Description'));
        department.Manager__c = String.valueOf(departmentinfo.get('Manager')) ; 
        department.Member__c = String.valueOf(departmentinfo.get('Member')) ; 
        department.Project_Managers__c = String.valueOf(departmentinfo.get('Project_Manager')) ; 


            insert department;
            return department ;
    }
    @AuraEnabled(cacheable=true)
    public static list <Department__c> getDepartment(Id DepartmentId){
        return [ 
            SELECT Name, Description__c,Member__c,	Manager__c,Project_Managers__c
            FROM Department__c
            WHERE Id=:DepartmentId 
            WITH SECURITY_ENFORCED
            ] ;
    }
    

}