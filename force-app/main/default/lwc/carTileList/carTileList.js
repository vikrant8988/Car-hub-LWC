import { LightningElement ,wire} from 'lwc';
import getCars from '@salesforce/apex/carController.getCars';

//importing Lightnig Message Service
import CAR_FILTERED_MESSAGE from '@salesforce/messageChannel/CarsFiltered__c';
import CAR_Select_MESSAGE from '@salesforce/messageChannel/CarSelected__c';
import {subscribe,MessageContext, publish, unsubscribe} from 'lightning/messageService';

export default class CarTileList extends LightningElement {
    cars=[]
    error
    filters={}
    carFilterSubscription

    @wire(MessageContext)
    messageContext

    @wire(getCars,{filters:'$filters'})
    carsHandler({data,error}){
        if(data){
            this.cars = data
        }
        if(error){
            this.error = error
        }
    }

    connectedCallback(){
        this.carFilterSubscription = subscribe(this.messageContext,CAR_FILTERED_MESSAGE,(msg)=>this.handleMessageChannel(msg))
    }

    handleMessageChannel(msg){
        this.filters = msg.filters;
    }

    handleCarSelect(event){
        publish(this.messageContext,CAR_Select_MESSAGE,{
            carId:event.detail
        })
    }
    
    disconnectedCallback(){
        unsubscribe(this.carFilterSubscription)
        this.carFilterSubscription = null
    }
}