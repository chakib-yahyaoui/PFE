import { LightningElement, track } from 'lwc';

export default class Clock extends LightningElement {
    @track hours;
    @track minutes;
    @track seconds;
    @track time;

    connectedCallback(){
        this.showTime();
    }
    timeoutFunction(){
        const timout = setTimeout(function(){
            this.showTime();
        }.bind(this),1000
        )
    }
    showTime(){
        let date = new Date();
        let session = "AM";
        this.hours = date.getHours();
        this.minutes = date.getMinutes();
        this.seconds = date.getSeconds();
        if(this.hours == 0){
            this.hours=12;
        }
        if(this.hours >12){
            this.hours = this.hours -12;
            session= "PM";
        }
        this.hours= (this.hours <10) ? "0" + this.hours:this.hours;
        this.minutes= (this.minutes <10) ? "0" + this.minutes:this.minutes;
        this.seconds= (this.seconds <10) ? "0" + this.seconds:this.seconds;

        this.time= this.hours + ":" + this.minutes + ":" +this.seconds + " "+ session;

        this.timeoutFunction();

    }
}