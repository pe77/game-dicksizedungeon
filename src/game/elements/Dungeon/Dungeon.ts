import { PkElement } from "../../../pkframe/element/PkElement";
import { T } from "../../Types";
import { PkScene } from "../../../pkframe/scene/PKScene";
import { Hero } from "../Characters/Hero";
import { Monster } from "../Characters/Monster";
import { Chest } from "./Chest";
import { Nothing } from "./Nothing";
import { GameEvents } from "../../Events";
import { Question } from "./Question";

export class Dungeon extends PkElement
{
    dfound:T.DungeonsFound = T.DungeonsFound.NOTHING;
    
    private _level:number;
    get level():number {
        return this._level;
    }

    private _hero:Hero;
    get hero():Hero {
        return this._hero;
    }

    private _monster:Monster;
    get monster():Monster {
        return this._monster;
    }

    private _chest:Chest;
    get chest():Chest {
        return this._chest;
    }

    private _nothing:Nothing;
    get nothing():Nothing {
        return this._nothing;
    }

    private _question:Question;
    get question():Question {
        return this._question;
    }

    private _interacting:boolean = false;
    get interacting():boolean {
        return this._interacting;
    }

    private created:boolean = false;

    constructor(scene:PkScene, hero:Hero, level:number = 1)
    {
        super(scene);
        this._level  = level;
        this._hero   = hero;
    }

    setMonster(monster?:Monster)
    {
        this.dfound = T.DungeonsFound.MONSTER;

        if(monster)
            this._monster = monster;
        else{
            // @todo create monster by dungeon level
        }

        this._monster.event.add(GameEvents.OnCharacterPlayDamageAnimation, (e, die)=>{
            console.log('monster hit', die)
            this.endInteraction();
        }, this)
    }

    setChest(chest?:Chest)
    {
        this.dfound = T.DungeonsFound.CHEST;

        if(chest)
            this._chest = chest;
        else{
            // @todo create chest by dungeon level
        }

        this._chest.event.add(GameEvents.OnChestOpen, ()=>{
            this.endInteraction();
        }, this);
    }

    setQuestion(question?:Question)
    {
        this.dfound = T.DungeonsFound.QUESTION;

        if(question)
            this._question = question;
        else{
            // @todo create question by dungeon level
        }

        this._question.event.add(GameEvents.OnQuestionInteract, ()=>{
            this.endInteraction();
        }, this);
    }

    setNothing()
    {
        this.dfound = T.DungeonsFound.NOTHING;

        this._nothing = new Nothing(this.pkScene);

        this._nothing.event.add(GameEvents.OnNothingInteract, ()=>{
            this.endInteraction();
        }, this);
    }
    
    create()
    {
        if(this.created)
            return;
        //

        this.created = true;

        // @todo
    }


    interact()
    {
        // se já estiver interagindo, ignora
        if(this._interacting)
            return false;
        //

        this._interacting = true;

        switch(this.dfound)
        {
            case T.DungeonsFound.MONSTER:
                this._hero.attack(this._monster);
                break;
            
            case T.DungeonsFound.NOTHING:
                this._nothing.playNothing();
                break;
            
            case T.DungeonsFound.CHEST:
                this._chest.open();
                break;

            case T.DungeonsFound.QUESTION:
                this._question.interact();
                break;

            default:
                this.endInteraction();
        }
    }

    private endInteraction()
    {
        this._interacting = false;
        this.event.dispatch(GameEvents.OnDungeonInteractEnd);
    }

}

