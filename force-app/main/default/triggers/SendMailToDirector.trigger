trigger SendMailToDirector on Case (after insert, after update) {
    for (Case newCase : Trigger.New  ) {
            if ( newCase.Status == 'New' ) {         
        EmailManager.sendMail('chakib.yahyaoui@esprit.tn', 'Nouvelle réclamation', ' Vous avez reçu une nouvelle réclamation');
    }
}
}