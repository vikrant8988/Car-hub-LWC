import { LightningElement ,api} from 'lwc';
import CAR_HUB_PLACEHOLDER from '@salesforce/resourceUrl/placeholder'

export default class PlaceHolder extends LightningElement {
    @api message

    placeHolderUrl = CAR_HUB_PLACEHOLDER
}