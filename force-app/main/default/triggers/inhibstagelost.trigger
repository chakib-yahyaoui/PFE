trigger inhibstagelost on Opportunity (before update) {
    List<Opportunity> relatedopp = [SELECT Id,Name,StageName FROM Opportunity
    WHERE Id IN :Trigger.New
    and StageName = 'Closed Lost '];
if (relatedopp.size()>0) {
    for (Opportunity newopp : Trigger.New  )  {
        if ( newopp.StageName == 'Lead detection & qualification' ) {
            newopp.addError('Vous ne pouvez pas passer à cette étape ! cette opportunité est déjà fermée.');
           }
           
  }
}
}