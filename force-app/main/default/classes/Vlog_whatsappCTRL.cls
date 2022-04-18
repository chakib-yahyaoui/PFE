public class Vlog_whatsappCTRL {
    @AuraEnabled 
    public static Contact fetchContact(String conId){
        return [Select Id, Name,Phone, MobilePhone FROM Contact where Id=:conId ];
    }
}