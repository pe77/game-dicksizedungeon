import { PkElement } from "../../../pkframe/element/PkElement";
import { MiniText } from "./MiniText";
import { PkUtils } from "../../../pkframe/utils/PkUtils";

export module E
{
	export const OnPhaseEnd:string 	= "OnPhaseEnd";
}

export class MiniPhrase extends PkElement
{
    texts:Array<MiniText> = new Array<MiniText>();
    bg:Phaser.GameObjects.Sprite;

    create()
    {
        this.bg = PkUtils.createSquare(this.scene, this.scene.game.canvas.width, this.scene.game.canvas.height)
        this.bg.visible = false;
        
        this.add(this.bg);
        

        for (const i in this.texts) 
        {
            this.texts[i].create();
            this.texts[i].visible = false;
        }

        
    }

    addText(text:MiniText)
    {
        this.texts.push(text);
        
        this.add(text);
    }

    play()
    {
        var cc:number = 0;
        var lst:number = 0; // last duration

        // show bg
        if(this.texts.length)
            this.bg.visible = true;
        //

        for (let i in this.texts) 
        {
            let miniText = this.texts[i];

            this.bringToTop(miniText);

            setTimeout(()=>{
                miniText.play(); // in
            }, lst)

            setTimeout(()=>{
                miniText.ploff(); // out

                // if last
                if(parseInt(i) >= this.texts.length-1)
                {
                    this.event.dispatch(E.OnPhaseEnd);
                    this.bg.visible = false;
                }
            }, miniText.duration + lst)

            lst += miniText.duration;

            cc++;
        }
    }

    static build(scene, texts:Array<{text:string, duration:number}>):MiniPhrase
    {
        var mp:MiniPhrase = new MiniPhrase(scene);
        var mtxs:Array<MiniText> = new Array<MiniText>();

        for(const i in texts)
        {
            var mt:MiniText =  new MiniText(scene, texts[i].text, texts[i].duration);
            mp.addText(mt);
        }
            
        //

        mp.create();

        return mp;
    }
}