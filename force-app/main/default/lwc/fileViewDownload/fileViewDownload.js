import { LightningElement, api, wire } from 'lwc';
import getRelatedFilesByRecordId  from '@salesforce/apex/filePreviewAndDownloadController.getRelatedFilesByRecordId'
import { NavigationMixin } from 'lightning/navigation';
export default class FilePreviewAndDownloads extends LightningElement{
    @api recordId
    @wire(getRelatedFilesByRecordId, {recordId: '$recordId'})
    wiredResult({data, error}){
        if(data){
            console.log(data)
            
        }
        if(error){
            console.log(error)
        }
    }
    
}