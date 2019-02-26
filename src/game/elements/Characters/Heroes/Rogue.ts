import { Hero } from "../Hero";
import { PkScene } from "../../../../pkframe/scene/PKScene";

export class Rogue extends Hero {

    // meta
    name:string = "Rogue";

    // stats
    ap:number  = 5; // action points
    hp:number  = 2; // health points
    atk:number = 4; // attack
    
    constructor(scene:PkScene)
    {
        super(scene);

        this.animationIdle = this.scene.anims.create({
            key:'idle' + this.getId(),
            frames:[
                { key:'rogue-idle-1' },
                { key:'rogue-idle-2' },
                { key:'rogue-idle-3' },
                { key:'rogue-idle-4' }
            ],
            frameRate: 8,
            repeat:-1
        });
    }
}