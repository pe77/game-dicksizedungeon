import { PkScene } from "../../pkframe/scene/PKScene";
import { TextScene } from "./TextScene";
import { PkElement } from "../../pkframe/element/PkElement";
import { MiniText } from "../elements/Text/MiniText";
import { Hero } from "../elements/Characters/Hero";
import { Knight } from "../elements/Characters/Heroes/Knight";
import { Mage } from "../elements/Characters/Heroes/Mage";
import { Rogue } from "../elements/Characters/Heroes/Rogue";
import { MiniPhrase, E } from "../elements/Text/MiniPhrase";

export class Main extends PkScene {
    
    wallMiddleTile:Phaser.GameObjects.TileSprite;
    wallBottomMiddleTile:Phaser.GameObjects.TileSprite;
    wallCollumns:Array<Phaser.GameObjects.TileSprite> = new Array<Phaser.GameObjects.TileSprite>();
    clickTokPlay:MiniPhrase;
    timeouts:Array<number> = new Array<number>();

    create()
    {
        super.create();

        this.addLayer('scene-bg');
        this.addLayer('characters');
        this.addLayer('scene-front');
        this.addLayer('scene-front-front'); // kek

        this.wallMiddleTile = this.add.tileSprite(0, 0, this.game.canvas.width, this.game.canvas.height, 'wall-middle');
        this.wallBottomMiddleTile = this.add.tileSprite(0, -12, this.game.canvas.width, 16, 'wall-top-middle');

        this.wallMiddleTile.setOrigin(0, 0)
        this.wallBottomMiddleTile.setOrigin(0, 0)

        this.wallMiddleTile.visible = false;
        this.wallBottomMiddleTile.visible = false;

        this.wallMiddleTile.alpha = 0.7;
        this.wallBottomMiddleTile.alpha = 0.5;

        this.addToLayer('scene-bg', this.wallMiddleTile);
        this.addToLayer('scene-bg', this.wallBottomMiddleTile);


        // bg fade
        var bgFade:Phaser.GameObjects.Sprite = this.add.sprite(0, 0, 'bg-fade-right');
        bgFade.setOrigin(0, 0)
        this.addToLayer('scene-front', bgFade);


        var blinkTime:number = 250;
        this.clickTokPlay = MiniPhrase.build(this, [
            {text:'*CLICK*', duration:blinkTime},
            {text:'TO', duration:blinkTime},
            {text:'PLAY', duration:blinkTime},
        ]);
        this.clickTokPlay.create();
        this.addToLayer('scene-front-front', this.clickTokPlay)


        /*
        this.wallCollumnMiddle = this.add.tileSprite(0, 0, 16, this.game.canvas.height, 'wall-column-middle');
        this.wallCollumnMiddle.setOrigin(0, 0)
        this.wallCollumnMiddle.x += 20;
        */
        

        // bg
        /* 
        var wallMiddleTile = this.add.tileSprite(0, 0, this.game.canvas.width, this.game.canvas.height, 'wall-middle');
        wallMiddleTile.setOrigin(0, 0)
        var wallTopMiddleTile = this.add.tileSprite(0, -12, this.game.canvas.width, 16, 'wall-top-middle');
        wallTopMiddleTile.setOrigin(0, 0)
        // */
        
        /*
        var txt:Phaser.GameObjects.Text = this.add.text(0, 0,
            'VOXEL', // text
            {
                fontFamily:'I Pixel U', 
                fontSize: 14,
                color: "#ffffff"
            } // font style
        );

        txt.setOrigin(.5, .5);
        txt.setStroke("#000", 5);
        txt.x = this.game.canvas.width / 2;
        txt.y = this.game.canvas.height / 2;
        */

        /*
        var text:MiniText = new MiniText(this, "VOXEL");
        text.create();
        text.x = 20;
        */

        /*
        var knight:Knight = new Knight(this);
        knight.create();
        knight.x += 7;
        knight.y -= 3;

        var mage:Mage = new Mage(this);
        mage.create();
        mage.x += 30;
        mage.y -= 3;

        var rogue:Rogue = new Rogue(this);
        rogue.create();
        rogue.x += 53;
        rogue.y -= 3;
        */
        
       

        // text.x = this.game.canvas.width / 2;
        // text.y = this.game.canvas.height / 2;
        
        setTimeout(()=>{
            this.transition.change('HeroSelect')
            console.log('- OUT -')

        }, 1000 * 5);

        this.opening();
        // this.waiting();

    }        

    opening()
    {   
        var mp:MiniPhrase = MiniPhrase.build(this, [
            { text:'WEALCOME', duration:550}, 
            { text:'TO', duration:450},
            { text:'DICK', duration:600},
            { text:'SIZE', duration:600},
        ])
        mp.event.add(E.OnPhaseEnd, ()=>{
            var mp:MiniPhrase = MiniPhrase.build(this, [
                { text:'DUNGEON', duration:600},
                { text:'', duration:300},
                { text:'DUNGEON', duration:350},
                { text:'', duration:300},
                { text:'DUNGEON', duration:350},
            ])
            mp.play();

            mp.event.add(E.OnPhaseEnd, ()=>{
                this.waiting();
            }, this);
        }, this);
        mp.play();
    }

    waiting()
    {
        this.wallMiddleTile.visible         = true;
        this.wallBottomMiddleTile.visible   = true;
        
        var knight:Knight = new Knight(this);
        knight.create();
        knight.x += 7;
        knight.y -= 3;
        knight.run();

        this.addToLayer('characters', knight);
        
        // creating collumn - back
        var tid:number = setInterval(()=>{

            var wallCollumnMiddle = this.add.tileSprite(0, 0, 16, this.game.canvas.height, 'wall-column-middle');
            wallCollumnMiddle.setOrigin(0, 0)
            wallCollumnMiddle.x += this.game.canvas.width;

            this.addToLayer('scene-bg', wallCollumnMiddle);

            this.wallCollumns.push(wallCollumnMiddle);

            

            console.log('- Drop Collumn -');

            // this.children.bringToTop(knight);
        }, 2105);
        this.timeouts.push(tid)

        
        var tid:number = setInterval(()=>{

            var wallCollumnMiddle = this.add.tileSprite(0, 0, 16, this.game.canvas.height, 'wall-column-middle');
            wallCollumnMiddle.setOrigin(0, 0)
            wallCollumnMiddle.x += this.game.canvas.width;
            // wallCollumnMiddle.tint = 0;

            this.addToLayer('scene-front', wallCollumnMiddle);

            this.wallCollumns.push(wallCollumnMiddle);
        }, 3500);
        this.timeouts.push(tid)
        

        var tid:number = setInterval(()=>{
            this.clickTokPlay.play();
        }, 5100);
        this.timeouts.push(tid)

        // this.clickTokPlay.play();
    }

    update()
    {
        this.wallMiddleTile.tilePositionX += 0.8;
        this.wallBottomMiddleTile.tilePositionX += 0.8;

        for(const i in this.wallCollumns)
        {
            this.wallCollumns[i].x -= 0.8;
            if(this.wallCollumns[i].x < 0 - this.wallCollumns[i].width)
            {
                this.wallCollumns[i].destroy();
                this.wallCollumns.splice(i, 1);
            }
        }
    }

    shutdown()
    {
        for(var i in this.timeouts)
            clearInterval(this.timeouts[i])
        //
    }

    
}