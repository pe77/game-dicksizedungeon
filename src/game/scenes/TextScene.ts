import { PkScene } from "../../pkframe/scene/PKScene";
import { PkUtils } from "../../pkframe/utils/PkUtils";
import { T } from "../Types";
import { Hero } from "../elements/Characters/Hero";
import { Knight } from "../elements/Characters/Heroes/Knight";
import { Mage } from "../elements/Characters/Heroes/Mage";
import { Rogue } from "../elements/Characters/Heroes/Rogue";
import { PkTransitionSlide } from "../../pkframe/scene/transitions/Slide";

export class TextScene extends PkScene {
    
    hero:Hero;
    poly:Phaser.GameObjects.Polygon

    init()
    {
        super.init()
        this.transition.transitionAnimation = new PkTransitionSlide(this)
    }

    create()
    {
        super.create();

        console.log('- TextScene create ')


        if(!this.initData.length)
            return;
        //


        switch (this.initData[0]) {
            case T.Heroes.KNIGHT:
                this.hero = new Knight(this);
                break;

            case T.Heroes.MAGE:
                this.hero = new Mage(this);
                break;
            
            case T.Heroes.ROGUE:
                this.hero = new Rogue(this);
                break;
        
            default:
                break;
        }

        this.hero.create();

        setTimeout(()=>{
            console.log('back')
            // this.transition.change('HeroSelect')
        }, 1500)
        /*
        
        var points:Array<number> = [
            0, 0, // 1
            this.game.canvas.width, 0,  // 2
            this.game.canvas.width + (this.game.canvas.width / 2), this.game.canvas.height, // 4
            0, this.game.canvas.height // 3
        ]

        this.poly = this.add.polygon(0, 0, points, 0x0000FF);
        this.poly.setOrigin(0, 0);
        


        

        setTimeout(()=>{
            console.log('--?')
            this.poly.x = -this.poly.width;
        }, 1500)
        */

        
    }      
    
    update()
    {
        // this.poly.x -= 0.5;
    }

    
}