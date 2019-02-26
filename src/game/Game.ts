import * as $ from 'jquery';
import { PkGame } from "../pkframe/PkGame";
import { PkConfig } from '../pkframe/PkConfig';
import { Loader, Preloader } from './Loader';
import { Main } from './scenes/Main';
import { GameScene } from './scenes/GameScene';
import { HeroSelect } from './scenes/HeroSelect';
import { IntroScene } from './scenes/Intro';





export class Game extends PkGame {
 
    constructor() {

        super(new Config()); 

        // add states
        this.scene.add('Intro', IntroScene);
        this.scene.add('Main', Main);
        this.scene.add('HeroSelect', HeroSelect);
        this.scene.add('GameScene', GameScene);

    }
}


class Config extends PkConfig
{

    constructor()
    {
        super();

        // loading load screen assets (logo, loading bar, etc) [pre-preloading]
        this.preLoaderState = Preloader;

        // loading all* game assets
        this.loaderState = Loader;
        
        this.canvasSize = [80, 30];

        this.initialState = 'Intro';
    }
}




// inicia
$(document).ready(() => { 
    var game:Game = new Game();
});
