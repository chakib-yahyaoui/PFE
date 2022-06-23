public with sharing class UpdateContractStatus {
      List<Contract> contrat = new List<Contract>();
            public void StatusSigne(List<ContentDocumentLink> newContractPDF){
            for (ContentDocumentLink PDF :newContractPDF  ) {
                contrat = [SELECT Id, Status FROM Contract
                            WHERE Id=: PDF.LinkedEntityId];
                for (Contract con : contrat){
                    if (con.Status=='waiting for sign' || con.Status=='Expired'){
                    con.Status= 'signed';
                    update(con);
                }}
    
    }
            }}