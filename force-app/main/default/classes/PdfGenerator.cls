/**
 * Created by gerry on 2/23/2021.
 */

public with sharing class PdfGenerator
{
	@AuraEnabled
	public static List<Opportunity> getOpportunitiesController(){
		return [SELECT Id, Name ,	OwnerId FROM Opportunity WHERE CloseDate > LAST_MONTH]
            ;}}