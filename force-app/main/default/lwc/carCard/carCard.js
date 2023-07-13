import { LightningElement ,wire} from 'lwc';
import { getFieldValue } from 'lightning/uiRecordApi';

//Car__c Object Schema
import CAR_OBJECT from '@salesforce/schema/Car__c'
import NAME_FIELD from '@salesforce/schema/Car__c.Name'
import PICTURE_URL_FIELD from '@salesforce/schema/Car__c.PICTURE_URL__c'
import CATEGORY_FIELD from '@salesforce/schema/Car__c.Category__c'
import MAKE_FIELD from '@salesforce/schema/Car__c.Make__c'
import MSRP_FIELD from '@salesforce/schema/Car__c.MSRP__c'
import FUEL_FIELD from '@salesforce/schema/Car__c.Fuel_Type__c'
import SEATS_FIELD from '@salesforce/schema/Car__c.Number_of_Seats__c'
import CONTROL_FIELD from '@salesforce/schema/Car__c.Control__c'

//importing NavigationMixin to navigate record 
import { NavigationMixin } from 'lightning/navigation';


//importing message channel
import CAR_Selected_MESSAGE from '@salesforce/messageChannel/CarSelected__c';
import {subscribe,unsubscribe,MessageContext} from 'lightning/messageService';

export default class CarCard extends NavigationMixin(LightningElement) {
    categoryField = CATEGORY_FIELD
    makeField = MAKE_FIELD
    msrpField = MSRP_FIELD
    fuelField = FUEL_FIELD
    seatsField = SEATS_FIELD
    controlField = CONTROL_FIELD

    carSelectedSubscription

    recordId

    carName
    carPictureURL


    @wire(MessageContext)
    messageContext

    handleEventView(event){
        const {records} = event.detail
        const recordData = records[this.recordId]
        this.carName = getFieldValue(recordData,NAME_FIELD)
        this.carPictureURL = getFieldValue(recordData,PICTURE_URL_FIELD)

    }

    handleNavigateRecord(){
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId:this.recordId,
                objectApiName: CAR_OBJECT.objectApiName,
                actionName: 'view',
            },
        }); 
    }

    connectedCallback(){
        this.carSelectedSubscription = subscribe(this.messageContext,CAR_Selected_MESSAGE,(msg)=>this.changeRecordId(msg))
    }

    changeRecordId(msg){
        this.recordId = msg.carId;
    }

    disconnectedCallback(){
        unsubscribe(this.carSelectedSubscription)
        this.carSelectedSubscription = null
    }



}