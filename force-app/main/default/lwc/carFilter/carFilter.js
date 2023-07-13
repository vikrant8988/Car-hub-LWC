import { LightningElement , wire } from 'lwc';
import {getPicklistValues,getObjectInfo} from 'lightning/uiObjectInfoApi';

//car Schema
import CAR_OBJECT from '@salesforce/schema/Car__c';
import CATEGORY_FIELD from '@salesforce/schema/Car__c.Category__C';
import MAKE_FIELD from '@salesforce/schema/Car__c.make__c';

//Error variables
const CATEGORY_ERROR="Error While Loading Category Picklist";
const MAKE_ERROR="Eror While Loading Make Picklist";

//importing Lightnig Message Service
import CAR_FILTERED_MESSAGE from '@salesforce/messageChannel/CarsFiltered__c';
import {publish,MessageContext} from 'lightning/messageService';

export default class CarFilter extends LightningElement {

    categoryError = CATEGORY_ERROR
    makeError=MAKE_ERROR
    timer

    filters={
        maxPrice:999999,
        searchKey:''
    }

    @wire(MessageContext)
    messageContext

    /***fetching Category picklist */
    @wire(getObjectInfo, { objectApiName: CAR_OBJECT })
    carObjectInfo;

    @wire(getPicklistValues, { recordTypeId: '$carObjectInfo.data.defaultRecordTypeId', fieldApiName: CATEGORY_FIELD })
    categories;

    /***Fetching Make Picklist Value */
    @wire(getPicklistValues, { recordTypeId: '$carObjectInfo.data.defaultRecordTypeId', fieldApiName: MAKE_FIELD })
    makeType;

    handleSearchKeyChange(event){
        this.filters = {...this.filters,"searchKey":event.target.value};
        this.sendDataToCarTileList();
    }

    handleMaxPriceChange(event){
        console.log(event);
        this.filters = {...this.filters,"maxPrice":event.target.value};
        this.sendDataToCarTileList();
    }

    handleCheckbox(event){
        if(!this.filters.categories){
            const categories = this.categories.data.values.map(item=>item.value)
            const makeType = this.makeType.data.values.map(item=>item.value)
            this.filters ={...this.filters,categories,makeType}
        }
        const {name,value} = event.target.dataset;
        if(event.target.checked){
            if(!this.filters[name].includes(value))
                this.filters[name] = [...this.filters[name] ,value]
        }else{
            this.filters[name] = this.filters[name].filter(item=>item !== value)
        }
        this.sendDataToCarTileList();
    }

    sendDataToCarTileList(){
        window.clearTimeout(this.timer)
        this.timer = window.setTimeout(()=>{
            publish(this.messageContext,CAR_FILTERED_MESSAGE,{filters:this.filters})
        },400)
    }
}