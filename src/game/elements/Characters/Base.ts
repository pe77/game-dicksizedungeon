import { Character } from "./Character";

export interface ICharacter
{
    hp:number;
    atk:number;

    attack(char:Character):number; // return damage
    create():void;
}

