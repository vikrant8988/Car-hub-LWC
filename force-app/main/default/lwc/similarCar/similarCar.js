import { LightningElement ,wire,api} from 'lwc';
import getSimilarCars from '@salesforce/apex/carController.getSimilarCars'
import MAKE_FIELD from '@salesforce/schema/Car__c.Make__c'
import { getRecord } from 'lightning/uiRecordApi';
import {NavigationMixin} from  'lightning/navigation'

export default class SimilarCar extends NavigationMixin(LightningElement) {

    @api recordId
    @api objectApiName
    similarCars

    @wire(getRecord,{recordId:'$recordId',fields:[MAKE_FIELD]})
    car

    fetchSimilarCars(){
        getSimilarCars({
            carId:this.recordId,
            makeType:this.car.data.fields.Make__c.value
        }).then(rst=>{
            this.similarCars = rst
        }).catch(error=>{
            console.log(error)
        })
    }

    handleViewDetailsClick(event){
        this[NavigationMixin.Navigate]({
            type:'standard__recordPage',
            attributes:{
                recordId:event.target.dataset.id,
                objectApiName:this.objectApiName,
                actionName:'view'
            }
        })

    }
}