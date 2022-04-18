trigger UserTrigger on User (before insert, before update, after undelete) {
    
  
    List<User> userList = new List<User>();
    Set<String> newEmailSet = new Set<String>();
    Set<String> existingEmailSet = new Set<String>();
    if (Trigger.isBefore && ( Trigger.isInsert || Trigger.isUpdate )) {
        userList = Trigger.New;
    } 
    if ( Trigger.IsAfter && Trigger.isUndelete ) {
        userList = Trigger.New;
    }
    // Step 2 - Add new emails into a Set
    for ( User user : userList ) {
        if ( user.Email != null ) {
            newEmailSet.add(user.Email);
        }
    }
    // Step 3 - Make a SQOL on User Object to get the Duplicate Records 
    
    List<User> existingUserList = [Select Id, Email From User 
                                         Where Email IN: newEmailSet AND Email != null];
    // Step 4
    for (User user : existingUserList ) {
        existingEmailSet.add(user.Email);
    }
    
    // Step 5 
    
    for ( User user : userList ) { // the list we are inserting or updating
        if ( existingEmailSet.contains( user.Email ) ) {
            user.SenderEmail.AddError(' Duplicate Email is not Allowed ');
        } else {
            existingEmailSet.add(user.Email);
        }
    }}