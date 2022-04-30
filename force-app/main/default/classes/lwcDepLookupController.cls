public class lwcDepLookupController {
	//custom lookup lwc
@AuraEnabled(cacheable=true)
public static List<Department__c> getCustomLookupDepartment (String prjtName){
   List<Department__c> depLookupList =  new List<Department__c>();
   if(prjtName != ''){
       String departmentName = '%' + prjtName + '%';
       depLookupList = [Select Id, Name From Department__c Where Name like:departmentName];
       return depLookupList;
   }
   return depLookupList;
}   
 
}