public class Redirect {
    public redirect(ApexPages.StandardController controller){
        
    }
    redirect redir;
    public PageReference save(){
        System.debug('Redirect succesfully');
        PageReference pg= new PageReference('/00h8d0000019kmuAAA/view');
        pg.setRedirect(true);
        return pg;
    }
}