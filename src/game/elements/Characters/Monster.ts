import { Hero } from "./Hero";
import { Character } from "./Character";

export class Monster extends Character {

    // meta
    name:string = "Monster";
    
    // stats
    hp:number  = 1; // health points
    atk:number = 1; // attack
    def:number = 1; // defense
 
    attack(hero:Hero):number
    {
        return 0;
    }
}