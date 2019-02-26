import { Monster } from "./Monster";
import { Character } from "./Character";
import { PkScene } from "../../../pkframe/scene/PKScene";

export class Hero extends Character {

    // meta
    name:string = "Hero";
    
    // stats
    ap:number  = 3; // action points

    animationRun:Phaser.Animations.Animation;

    constructor(scene:PkScene)
    {
        super(scene);
    }

    create()
    {
        super.create()
    }

    attack(monster:Monster):number
    {
        return 0;
    }

    run()
    {
        this.spriteBase.play('run' + this.getId());
    }
}