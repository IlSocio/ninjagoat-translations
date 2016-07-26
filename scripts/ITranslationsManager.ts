import {IPromise} from "rx";
import {Dictionary} from "ninjagoat";

interface ITranslationsManager {
    translate(key:string, fallback:string):string;
    load():IPromise<{ language:string; translations:Dictionary<string> }>;
}

export default ITranslationsManager