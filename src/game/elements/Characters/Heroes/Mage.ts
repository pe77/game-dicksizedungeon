import { Hero } from "../Hero";
import { PkScene } from "../../../../pkframe/scene/PKScene";

export class Mage extends Hero {

    // meta
    name:string = "Mage";

    // stats
    ap:number  = 3; // action points
    hp:number  = 3; // health points
    atk:number = 4; // attack
    
    constructor(scene:PkScene)
    {
        super(scene);

        this.animationIdle = this.scene.anims.create({
            key:'idle' + this.getId(),
            frames:[
                { key:'mage-idle-1' },
                { key:'mage-idle-2' },
                { key:'mage-idle-3' },
                { key:'mage-idle-4' }
            ],
            frameRate: 8,
            repeat:-1
        });
    }
}