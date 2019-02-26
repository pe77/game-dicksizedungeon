import { PkScene } from "../../pkframe/scene/PKScene";
import { TextScene } from "./GameScene";
import { PkElement } from "../../pkframe/element/PkElement";
import { MiniText } from "../elements/Text/MiniText";
import { Hero } from "../elements/Characters/Hero";
import { Knight } from "../elements/Characters/Heroes/Knight";
import { Mage } from "../elements/Characters/Heroes/Mage";
import { Rogue } from "../elements/Characters/Heroes/Rogue";
import { MiniPhrase, E } from "../elements/Text/MiniPhrase";
import { PkUtils } from "../../pkframe/utils/PkUtils";
import { T } from "../Types";
import { PkTransitionSlide } from "../../pkframe/scene/transitions/Slide";

export class HeroSelect extends PkScene {
    
    wallMiddleTile:Phaser.GameObjects.TileSprite;
    wallBottomMiddleTile:Phaser.GameObjects.TileSprite;
    wallCollumns:Array<Phaser.GameObjects.TileSprite> = new Array<Phaser.GameObjects.TileSprite>();
    chooseYourHero:MiniPhrase;

    knight:Knight;
    mage:Mage;
    rogue:Rogue;

    timeouts:Array<number> = new Array<number>();

    knightClickArea:Phaser.GameObjects.Sprite;
    rogueClickArea:Phaser.GameObjects.Sprite;
    mageClickArea:Phaser.GameObjects.Sprite;

    init()
    {
        super.init()
        this.transition.transitionAnimation = new PkTransitionSlide(this)
    }

    create()
    {
        super.create();

        console.log('- hero select creating layers')
        this.addLayer('scene-bg');
        this.addLayer('characters');
        this.addLayer('scene-front');
        this.addLayer('scene-front-front'); // kek


        // walls
        this.wallMiddleTile = this.add.tileSprite(0, 0, this.game.canvas.width, this.game.canvas.height, 'wall-middle');
        this.wallBottomMiddleTile = this.add.tileSprite(0, -12, this.game.canvas.width, 16, 'wall-top-middle');

        this.wallMiddleTile.setOrigin(0, 0)
        this.wallBottomMiddleTile.setOrigin(0, 0)

        // waiting text
        var blinkTime:number = 300;
        this.chooseYourHero = MiniPhrase.build(this, [
            {text:'CHOOSE', duration:blinkTime},
            {text:'YOUR', duration:blinkTime},
            {text:'HERO', duration:blinkTime + 100},
        ]);
        this.chooseYourHero.create();
        this.addToLayer('scene-front-front', this.chooseYourHero)

        this.wallMiddleTile.alpha = 0.7;

        this.addToLayer('scene-bg', this.wallMiddleTile);

        // heores
        this.knight = new Knight(this);
        this.knight.create();
        this.knight.spriteBase.originX = 0.5
        this.knight.x += 17;
        this.knight.y += 200;

        this.mage = new Mage(this);
        this.mage.create();
        this.mage.spriteBase.originX = 0.5
        this.mage.x += 40;
        this.mage.y += 200;

        this.rogue = new Rogue(this);
        this.rogue.create();
        this.rogue.spriteBase.originX = 0.5
        this.rogue.x += 63;
        this.rogue.y += 200;

        this.addToLayer('scene-bg', this.knight);
        this.addToLayer('scene-bg', this.mage);
        this.addToLayer('scene-bg', this.rogue);

        // click area
        this.knightClickArea = PkUtils.createSquare(this, this.game.canvas.width / 3, this.game.canvas.height, 0xFF0000)
        this.knightClickArea.alpha = 0.01;

        this.mageClickArea = PkUtils.createSquare(this, this.game.canvas.width / 3, this.game.canvas.height, 0x0000FF)
        this.mageClickArea.x = this.game.canvas.width / 3;
        this.mageClickArea.alpha = 0.01;

        this.rogueClickArea = PkUtils.createSquare(this, this.game.canvas.width / 3, this.game.canvas.height, 0x00FF00)
        this.rogueClickArea.x = (this.game.canvas.width / 3) * 2;
        this.rogueClickArea.alpha = 0.01;

        
        this.knightClickArea.setInteractive({ useHandCursor: true  })
        this.knightClickArea.on('pointerup', pointer=>{
            this.transition.change('GameScene', T.Heroes.KNIGHT)
        })

        this.mageClickArea.setInteractive({ useHandCursor: true  })
        this.mageClickArea.on('pointerup', pointer=>{
            this.transition.change('GameScene', T.Heroes.MAGE)
        })

        this.rogueClickArea.setInteractive({ useHandCursor: true  })
        this.rogueClickArea.on('pointerup', pointer=>{
            this.transition.change('GameScene', T.Heroes.ROGUE)
        })
        
       
        this.heroesIntro()
    }      

    heroesIntro()
    {
         // jump drop
         this.tweens.add({
            targets: [ this.knight, this.mage, this.rogue ],
            y: -3,
            // yoyo: true,
            duration: 500,
            ease: 'Back.easeOut',
            // repeat: -1,
            delay: function (i, total, target) {
                return i * 350;
            },
            onComplete: ()=>{

                this.timeouts.push(setTimeout(()=>{
                    this.waiting();
                }, 500));

                this.knight.idle();
                this.mage.idle();
                this.rogue.idle();
                
            }
        });

        // squeeze
        this.tweens.add({
            targets: [ this.knight, this.mage, this.rogue ],
            scaleX: .5,
            yoyo: true,
            duration: 250,
            ease: 'Bounce.easeOut',
            delay: function (i, total, target) {
                return i * 175;
            }
        });
    }

    waiting()
    {

        this.timeouts.push(setInterval(()=>{
            this.chooseYourHero.play();
        }, 5100));

        this.chooseYourHero.play();
    }
    
    shutdown()
    {
        console.log('-- hero select out --');

        // clear intervals
        for(var i in this.timeouts)
            clearInterval(this.timeouts[i])
        //
    }

}