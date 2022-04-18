import { LightningElement, api, wire } from 'lwc';
import getRelatedFilesByRecordId  from '@salesforce/apex/filePreviewAndDownloadController.getRelatedFilesByRecordId'
import { NavigationMixin } from 'lightning/navigation';
export default class FilePreviewAndDownloads extends LightningElement{
    @api recordId
    filesList = []
    @wire(getRelatedFilesByRecordId, {recordId: '$recordId'})
    wiredResult({data, error}){
        if(data){
            console.log(data)
            this.filesList = Object.keys(data).map(item=>({"label":data[item],
            "value":item,
            "url": `/sfc/servlet.shepherd/document/download/${item}`
            }))
            console.log(this.filesList)
        }
        if(error){
            console.log(error)
        }
    }
    previewHandler(event){
        console.log(event.target.dataset.id)
    }
}