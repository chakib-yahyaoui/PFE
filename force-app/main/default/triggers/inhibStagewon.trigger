trigger inhibStagewon on Opportunity (before update) { 
    List<Opportunity> relatedopp = [SELECT Id,Name,StageName FROM Opportunity
    WHERE Id IN :Trigger.New
    and StageName = 'Closed Won '];
if (relatedopp.size()>0) {
    for (Opportunity newopp : Trigger.New  )  {
        if ( newopp.StageName == 'Negociation' ||  newopp.StageName == 'business proposition' ||  newopp.StageName == 'Value Proposition' || newopp.StageName == 'Lead detection & qualification' ) {
            newopp.addError('Vous ne pouvez pas passer à cette étape ! cette opportunité est déjà fermée.');
           }
           
  }
}
}