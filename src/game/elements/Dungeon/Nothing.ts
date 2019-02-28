import { PkElement } from "../../../pkframe/element/PkElement";
import { GameEvents } from "../../Events";

export class Nothing extends PkElement
{
    playNothing()
    {
        setTimeout(()=>{
            this.event.dispatch(GameEvents.OnNothingInteract);
        }, 100)
    }
}