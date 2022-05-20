public class projectListViewHelper {
	@AuraEnabled(cacheable=True)
    public static List<Project__c> getProjects(){
        return [SELECT Id, Name, Specifications__c, Department__c ,
                Date_begin__c, Date_end__c
                FROM Project__c
                WITH SECURITY_ENFORCED];
    }
    @AuraEnabled(cacheable=true)
    public static list <Project__c> getProject(Id ProjectId){
        return [ 
            SELECT Name, Specifications__c, Department__c ,
                Date_begin__c, Date_end__c
            FROM Project__c
            WHERE Id=:ProjectId 
            WITH SECURITY_ENFORCED
            ] ;
    }

    @AuraEnabled(cacheable=True)
    public static List<Project__c> searchProject(String searchString){
        List<List<SObject>> projects = [FIND :searchString IN ALL FIELDS RETURNING Project__c(Name, Specifications__c, department__c ,
                Date_begin__c, Date_end__c)];

        return (List<Project__c>) projects[0];
    }

    @AuraEnabled
    public static void deleteProjects(List<Id> projectIds){
        if(projectIds.size() > 0 ){
            delete [SELECT Id FROM Project__c WHERE Id in: projectIds];
        }
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
    public static Project__c createProject (Object ProjectRecObj){
        Map<String,Object> projectinfo = (Map<String, Object>) JSON.deserializeUntyped(JSON.serialize(ProjectRecObj));
        Project__c project = new Project__c() ;
       
        project.Name = String.valueOf(projectinfo.get('Name'));
        project.Specifications__c = String.valueOf(projectinfo.get('Specifications'));
        project.Date_begin__c = Date.valueOf(projectinfo.get('Date_begin')) ; 
        date mydate = date.parse('dd/mm/aaaa');
        project.Date_end__c = Date.valueOf(projectinfo.get('Date_end')) ; 
        date mydate1 = date.parse('dd/mm/aaaa');
        project.Members__c = String.valueOf(projectinfo.get('Members')) ; 
        project.Department__c = String.valueOf(projectinfo.get('Department')) ; 


            insert project;
            return project ;
    }
    @AuraEnabled(cacheable=true)
    public static list <Department__c> getDepartmentList(){
        return [ 
            SELECT Id , Name
            FROM Department__c
            WITH SECURITY_ENFORCED
            ] ;
    }
    @AuraEnabled
    public static Project__c updateProject(Project__c prj){
        Project__c project  = new Project__c() ;
        project = prj;
        update project ;
        return project ;
    }
}