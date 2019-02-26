import { PkElement } from "../../../pkframe/element/PkElement";
import { PkScene } from "../../../pkframe/scene/PKScene";

export class MiniText extends PkElement {
    
    txtObj:Phaser.GameObjects.Text;
    text:string;
    style:object = {
        fontFamily:'I Pixel U', 
        fontSize: 14,
        color: "#ffffff"
    };
    duration:number;
    centralized:boolean = true;

    constructor(scene:PkScene, text:string, duration:number = 400)
    {
        super(scene);


        this.text = text;
        this.duration = duration;
        
    }

    create()
    {
        this.txtObj = this.scene.add.text(0, 0, this.text, this.style);
        this.txtObj.setStroke("#000", 5);

        this.add(this.txtObj);
    }

    play() // anima entrada
    {
        if(!this.scene)
            return;
        //
        
        if(this.centralized)
        {
            this.x = this.scene.game.canvas.width / 2 - this.txtObj.width / 2;
            this.y = this.scene.game.canvas.height / 2 - this.txtObj.height / 2;
            this.y -= 2;
        }

        this.visible = true;
    }

    ploff() // anima saida
    {
        this.visible = false;
    }
}