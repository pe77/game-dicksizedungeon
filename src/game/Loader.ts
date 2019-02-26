import { PkLoaderPreLoader } from "../pkframe/PkGame";
import { PkLoader, I } from "../pkframe/PkLoader";
import { PkUtils } from "../pkframe/utils/PkUtils";

export class Preloader  extends PkLoaderPreLoader {

    preload()
    {
        // utils / vendor
        this.load.script('WebFont', 'src/pkframe/vendor/webfontloader.js');

        // load game loading bar
        this.load.image('game-loading-bar', 'assets/scenes/default/images/loading-bar.png');

        // load game loading logo
        // this.load.image('game-loading-logo', 'assets/states/loader/images/logo.png');
    }

}


export class Loader extends PkLoader implements I.Loader {

    loadingBar:Phaser.GameObjects.Sprite;
    logo:Phaser.GameObjects.Sprite;
    loadingText:Phaser.GameObjects.Sprite;
    
    init()
    {
        super.init();
    }

    preload()
    {
        // ignore preloading bar
        super.preload();

        // create custom loading bar
        this.loadingBar = PkUtils.createSquare(this, (this.game.canvas.width / 1.5), 5, 0xFFFFFF);

        // pos loading bar on bot
        this.loadingBar.y = this.game.canvas.height / 2 - this.loadingBar.height / 2;
        this.loadingBar.x = this.game.canvas.width / 2 - this.loadingBar.width / 2;

        this.load.on('progress', value => {

            var v:number = Math.round(value * 100);
            this.loadingBar.scaleX = (v * 0.01);
        });

        this.load.on('complete', function (value) {
            console.log('load complete')
        })

        /*
        // dumb test asset
        for (let index = 0; index < 200; index++) 
            this.load.image('game-loading-bar' + index, 'assets/scenes/default/images/loading-bar.png');
        // */

        // walls
        this.load.image('wall-middle', 'assets/default/sprites/wall_mid.png');
        this.load.image('wall-top-middle', 'assets/default/sprites/wall_top_mid.png');

        // wall collun
        this.load.image('wall-column-middle', 'assets/default/sprites/wall_column_mid.png');

        // bg - fade
        this.load.image('bg-fade-right', 'assets/default/sprites/bg-fade-right.png');

        // animations

        // knight
        this.load.image('knight-idle-1', 'assets/default/sprites/knight_m_idle_anim_f0.png');
        this.load.image('knight-idle-2', 'assets/default/sprites/knight_m_idle_anim_f1.png');
        this.load.image('knight-idle-3', 'assets/default/sprites/knight_m_idle_anim_f2.png');
        this.load.image('knight-idle-4', 'assets/default/sprites/knight_m_idle_anim_f3.png');

        this.load.image('knight-run-1', 'assets/default/sprites/knight_f_run_anim_f0.png');
        this.load.image('knight-run-2', 'assets/default/sprites/knight_f_run_anim_f1.png');
        this.load.image('knight-run-3', 'assets/default/sprites/knight_f_run_anim_f2.png');
        this.load.image('knight-run-4', 'assets/default/sprites/knight_f_run_anim_f3.png');


        // mage
        this.load.image('mage-idle-1', 'assets/default/sprites/wizzard_m_idle_anim_f0.png');
        this.load.image('mage-idle-2', 'assets/default/sprites/wizzard_m_idle_anim_f1.png');
        this.load.image('mage-idle-3', 'assets/default/sprites/wizzard_m_idle_anim_f2.png');
        this.load.image('mage-idle-4', 'assets/default/sprites/wizzard_m_idle_anim_f3.png');

        // rogue
        this.load.image('rogue-idle-1', 'assets/default/sprites/elf_m_idle_anim_f0.png');
        this.load.image('rogue-idle-2', 'assets/default/sprites/elf_m_idle_anim_f1.png');
        this.load.image('rogue-idle-3', 'assets/default/sprites/elf_m_idle_anim_f2.png');
        this.load.image('rogue-idle-4', 'assets/default/sprites/elf_m_idle_anim_f3.png');
        
        //  ** ADDING Other things  ** //

        // this.load.image('cinematic-bg', 'assets/states/intro/images/cinematic-bg.jpg');
        // this.load.audio('intro-sound', 'assets/states/intro/sounds/intro.mp3');
        // this.load.spritesheet('char1-idle', 'assets/default/images/chars/heroes/1/iddle.png', 158, 263, 12);
        
    }

    create()
    {
        super.create();
    }
}