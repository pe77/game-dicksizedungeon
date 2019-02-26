import { Hero } from "../Hero";
import { PkScene } from "../../../../pkframe/scene/PKScene";

export class Knight extends Hero {

    // meta
    name:string = "Knight";

    // stats
    ap:number  = 2; // action points
    hp:number  = 6; // health points
    atk:number = 2; // attack
    
    constructor(scene:PkScene)
    {
        super(scene);

        this.animationIdle = this.scene.anims.create({
            key:'idle' + this.getId(),
            frames:[
                { key:'knight-idle-1' },
                { key:'knight-idle-2' },
                { key:'knight-idle-3' },
                { key:'knight-idle-4' }
            ],
            frameRate: 8,
            repeat:-1
        });

        this.animationRun = this.scene.anims.create({
            key:'run' + this.getId(),
            frames:[
                { key:'knight-run-1' },
                { key:'knight-run-2' },
                { key:'knight-run-3' },
                { key:'knight-run-4' }
            ],
            frameRate: 8,
            repeat:-1
        });
    }
}