trigger signatureContrat on Contract (before Update) {
    List<ContentDocumentLink> PDF = new List<ContentDocumentLink>();
    for (Contract newContract :Trigger.New  ) {
        if ( newContract.Status == 'Signed'){
PDF = [SELECT ContentDocumentId FROM ContentDocumentLink
                    WHERE LinkedEntityId=: newContract.Id ];
if (PDF.size() == 0) {
   newContract.addError('Ce contrat n\'a pas encore été signé !');
           }
  }
}}