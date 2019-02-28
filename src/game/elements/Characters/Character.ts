import { PkElement } from "../../../pkframe/element/PkElement";
import { ICharacter } from "./Base";
import { PkScene } from "../../../pkframe/scene/PKScene";
import { GameEvents } from "../../Events";

export class Character extends PkElement implements ICharacter
{
    // meta
    name:string = "Char-Name";
    
    // stats
    hp:number  = 1; // health points
    atk:number = 1; // attack

    spriteBase:Phaser.GameObjects.Sprite;
    animationIdle:Phaser.Animations.Animation;
    
    constructor(scene:PkScene)
    {
        super(scene);
    }

    create()
    {
        if(this.animationIdle)
            this.spriteBase = this.scene.add.sprite(0, 0, this.animationIdle.frames[0].textureKey);
        else
            this.spriteBase = this.scene.add.sprite(0, 0, '');
        //

        this.spriteBase.setOrigin(0, 0);
        this.add(this.spriteBase);
        this.idle();
    }

    attack(char:Character):number
    {
        var damage:number = 1;

        char.playDamageAnimation(damage);
        return damage;
    }

    private playDamageAnimation(damage:number)
    {
        // play damage animation...
        setTimeout(()=>{
            this.event.dispatch(GameEvents.OnCharacterPlayDamageAnimation, (this.hp < 0))
        }, 100)
    }

    idle()
    {
        this.spriteBase.play('idle' + this.getId());
    }

    idleStop()
    {
        this.spriteBase.anims.stop();
    }
}