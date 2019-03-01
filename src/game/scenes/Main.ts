import { PkScene } from "../../pkframe/scene/PKScene";
import { Knight } from "../elements/Characters/Heroes/Knight";
import { MiniPhrase, E } from "../elements/Text/MiniPhrase";
import { PkTransitionSlide } from "../../pkframe/scene/transitions/Slide";
import { PkUtils } from "../../pkframe/utils/PkUtils";
import { Layers } from "../Layers";

export class Main extends PkScene {
    
    wallMiddleTile:Phaser.GameObjects.TileSprite;
    wallBottomMiddleTile:Phaser.GameObjects.TileSprite;
    wallCollumns:Array<Phaser.GameObjects.TileSprite> = new Array<Phaser.GameObjects.TileSprite>();
    clickTokPlay:MiniPhrase;
    timeouts:Array<number> = new Array<number>();

    init()
    {
        super.init()
        this.transition.transitionAnimation = new PkTransitionSlide(this)
    }

    create()
    {
        super.create();

        this.addLayer(Layers.BG);
        this.addLayer(Layers.CHAR);
        this.addLayer(Layers.FG);
        this.addLayer(Layers.UI);

        this.wallMiddleTile = this.add.tileSprite(0, 0, this.game.canvas.width, this.game.canvas.height, 'wall-middle');
        this.wallBottomMiddleTile = this.add.tileSprite(0, -12, this.game.canvas.width, 16, 'wall-top-middle');

        this.wallMiddleTile.setOrigin(0, 0)
        this.wallBottomMiddleTile.setOrigin(0, 0)

        this.wallMiddleTile.alpha = 0.7;
        this.wallBottomMiddleTile.alpha = 0.5;

        this.addToLayer(Layers.BG, this.wallMiddleTile);
        this.addToLayer(Layers.BG, this.wallBottomMiddleTile);


        // bg fade
        var bgFade:Phaser.GameObjects.Sprite = this.add.sprite(0, 0, 'bg-fade-right');
        bgFade.setOrigin(0, 0)
        this.addToLayer(Layers.FG, bgFade);


        var blinkTime:number = 800;
        this.clickTokPlay = MiniPhrase.build(this, [
            {text:'*CLICK*', duration:blinkTime},
            {text:'TO', duration:blinkTime},
            {text:'PLAY', duration:blinkTime},
        ]);
        this.clickTokPlay.create();
        
        this.addToLayer(Layers.UI, this.clickTokPlay)

        var startGameClickArea:Phaser.GameObjects.Sprite = PkUtils.createSquare(this, this.game.canvas.width, this.game.canvas.height, 0x0000FF);
        startGameClickArea.alpha = 0.01;
        startGameClickArea.setInteractive({useHandCursor:true});
        startGameClickArea.on('pointerup', pointer=>{
            this.transition.change('HeroSelect')
        })
        

        var knight:Knight = new Knight(this);
        knight.create();
        knight.x += 7;
        knight.y -= 3;
        knight.run();

        this.addToLayer(Layers.CHAR, knight);
        
        // creating collumn - back
        var tid:number = setInterval(()=>{

            var wallCollumnMiddle = this.add.tileSprite(0, 0, 16, this.game.canvas.height, 'wall-column-middle');
            wallCollumnMiddle.setOrigin(0, 0)
            wallCollumnMiddle.x += this.game.canvas.width;

            this.addToLayer(Layers.BG, wallCollumnMiddle);

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

            this.addToLayer(Layers.FG, wallCollumnMiddle);

            this.wallCollumns.push(wallCollumnMiddle);
        }, 3500);
        this.timeouts.push(tid)
        

        var tid:number = setInterval(()=>{
            this.clickTokPlay.play();
        }, 1000*10); // 10 sec
        this.timeouts.push(tid)

        this.timeouts.push(setTimeout(()=>{
            this.clickTokPlay.play();
        }, 500))
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