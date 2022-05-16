import { LightningElement,track,wire } from 'lwc';
import getProjects from "@salesforce/apex/projectListViewHelper.getProjects"

export default class Dashboard extends LightningElement {
    @track  statusLavel;
    @track statusValue;
    @track statusColor;
    @track categoryLevel;
    @track categoryValue;
    @track categoryColor;
    @track priorityLevel;
    @track priorityValue;
    @track priorityColor;
    flag=false;
    projectName;
    defaultProject;
    DefaultMonth;
    areDetailVisible;
    isLoading;
    @wire(getProjects)
    getProjects({error,data}){
        this.isLoading=true;
        if(error){
            this.isLoading=false;
        }
        else if(data){
            this.isLoading=false;
            var listArray=[];
            var firstItem='';
            this.DefaultMonth = 'Current Month';
            for(var itm in data )
            {
                if(itm==0){
                    this.defaultProject=data[itm];
                }
                var listItem = {label:data[itm],value:data[itm]};
                listArray.push(listItem);
            }
            this.projectName=listArray;
            this.changeSelectedProject(this.defaultProject,this.DefaultMonth)
        }
    }
    get months(){
        return[
            {label:'Current Month',value:'Current Month'},
            {label:'Last Month',value:'last Month'}
        ];
    }
    handleChangeMonth(event){
        this.isLoading=true;
        this.DefaultMonth=event.detail.value;
        this.changeSelectedProject(this.defaultProject,this.DefaultMonth);
    }
    get options(){
        return this.projectName;
    }
    handleChange(event){
        this.isLoading=true;
        this.defaultProject=event.detail.value;
        this.changeSelectedProject(this.defaultProject,this.DefaultMonth);
    }
    
}