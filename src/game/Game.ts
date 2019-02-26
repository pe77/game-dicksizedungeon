import * as $ from 'jquery';
import { PkGame } from "../pkframe/PkGame";
import { PkConfig } from '../pkframe/PkConfig';
import { Loader, Preloader } from './Loader';
import { Main } from './scenes/Main';
import { TextScene } from './scenes/TextScene';
import { HeroSelect } from './scenes/HeroSelect';





export class Game extends PkGame {
 
    constructor() {

        super(new Config()); 

        // add default state
        this.scene.add('Main', Main);
        this.scene.add('HeroSelect', HeroSelect);
        this.scene.add('Text', TextScene);

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

        this.initialState = 'HeroSelect';
    }
}




// inicia
$(document).ready(() => { 
    var game:Game = new Game();
});
