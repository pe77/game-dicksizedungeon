import { PkElement } from "../../../pkframe/element/PkElement";
import { Item } from "../Itens/Item";
import { GameEvents } from "../../Events";

export class Chest extends PkElement
{
    private _item:Item;
    public get item() : Item {
        return this._item;
    }
    
    open()
    {
        // @todo - select item

        this.playOpenAnimation();
    }

    private playOpenAnimation()
    {
        setTimeout(()=>{
            this.event.dispatch(GameEvents.OnChestOpen, this._item);
        }, 100)
    }
}