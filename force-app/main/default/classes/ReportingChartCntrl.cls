public class ReportingChartCntrl {
	 @AuraEnabled 
    public static User fetchReportChartSettings(){
        User u = [select id,Report__c,Chart__c from User where id=:system.UserInfo.getUserId()];
        return u;
    }
    @AuraEnabled
    public static void updateSettings(String chartType, String reportName){
        User u = [select id,Report__c,Chart__c from User where id=:system.UserInfo.getUserId()];
        if(chartType !='' && reportName !=''){
            u.Chart__c = chartType;
            u.Report__c = reportName;
            //update 
            update u;
        }
    }
    @AuraEnabled
    public static List<String> fetchReports()
    {
        List<String> options = new List<String>();
        for(Report obj :[select id,name from report where Format='MATRIX' or Format ='Summary'] )//instead of BU_Project__c.Id pass actual id
        {
            options.add(obj.Name);
        }
        system.debug('Option Returned: '+options);
        return options;
    }
    @AuraEnabled
    public static String getReportData(string reportName){
        //Using report id for example purpose
        Report stdReport = [SELECT Name FROM Report WHERE Name =:reportName];
        // Get the Report data
        Reports.ReportResults reportReturned =Reports.ReportManager.runReport(stdReport.Id, true);
        system.debug('Report Data: '+JSON.serialize(reportReturned));
        //Return Report data in JSON serialize format.
        return JSON.serialize(reportReturned);
    }
}