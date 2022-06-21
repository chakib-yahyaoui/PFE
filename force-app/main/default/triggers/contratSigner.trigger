trigger contratSigner on ContentDocumentLink (after insert) {
    UpdateContractStatus obj=new UpdateContractStatus(); 
   if(trigger.isafter && trigger.isinsert) 
   {
    obj.StatusSigne(trigger.new);
   }}