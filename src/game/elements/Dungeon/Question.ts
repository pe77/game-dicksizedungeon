import { PkElement } from "../../../pkframe/element/PkElement";
import { GameEvents } from "../../Events";

export class Question extends PkElement
{
    
    interact()
    {
        // @todo - select interaction type

        this.playQuestionAnimation()
    }

    playQuestionAnimation()
    {
        setTimeout(()=>{
            this.event.dispatch(GameEvents.OnQuestionInteract);
        }, 100)
    }
}