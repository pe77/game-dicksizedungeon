import { PkScene } from "../../pkframe/scene/PKScene";
import { MiniPhrase, E } from "../elements/Text/MiniPhrase";
import { PkTransitionSlide } from "../../pkframe/scene/transitions/Slide";

export class IntroScene extends PkScene {
    
    init()
    {
        super.init()
        this.transition.transitionAnimation = new PkTransitionSlide(this)
    }

    create()
    {
        super.create();

        console.log('INTRO SCENE')

        var mp:MiniPhrase = MiniPhrase.build(this, [
            { text:'WEALCOME', duration:850}, 
            { text:'TO', duration:450},
            { text:'DICK', duration:800},
            { text:'SIZE', duration:800},
        ])
        mp.event.add(E.OnPhaseEnd, ()=>{
            var mp:MiniPhrase = MiniPhrase.build(this, [
                { text:'DUNGEON', duration:800},
                { text:'', duration:300},
                { text:'DUNGEON', duration:350},
                { text:'', duration:300},
                { text:'DUNGEON', duration:350},
            ])
            mp.play();

            mp.event.add(E.OnPhaseEnd, ()=>{
                console.log('CHANGE TO MAIN')
                this.transition.change('Main');
            }, this);
        }, this);
        mp.play();
    }        

    
}