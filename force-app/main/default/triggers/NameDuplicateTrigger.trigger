trigger NameDuplicateTrigger on Department__c (before insert,before update ){
    list<string> DepartmentNames=new list<string>();
    for(Department__c departmentVar:trigger.new)
    {
        DepartmentNames.add(departmentVar.name);
    }
    list<Department__c> listOfDuplicateDepartments=[select id,name from Department__c where name in :DepartmentNames];
    for(Department__c department:trigger.new)
    {
        if(trigger.isInsert){
        if(listOfDuplicateDepartments.size()!=0)
        {
            department.addError('Department already exists with this name');
        }
        }
        if(trigger.isUpdate)
        {
           for(Department__c olddepartment :trigger.old)
           {
               if(department.Name!=olddepartment.Name && listOfDuplicateDepartments.size()!=0)
               {
                   department.addError('Departement already exists with this name');
               }
           }
        }
    }
    

}