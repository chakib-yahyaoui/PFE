public class PdfGenerator
{
	@AuraEnabled
	public static List<Opportunity> getOpportunitiesController(){
		return [SELECT Id, Name ,	OwnerId FROM Opportunity WHERE CloseDate > LAST_MONTH]
            ;}}