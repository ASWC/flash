import { Stage } from './../display/Stage';
import { Rectangle } from './../geom/Rectangle';
import { StageTextInitOptions } from './StageTextInitOptions';
import { EventDispatcher } from './../events/EventDispatcher';

export class StageText extends EventDispatcher
{
    constructor(options:StageTextInitOptions)
    {
        super();
    }

    public viewPort:Rectangle;
    public stage:Stage;
    public editable:boolean;
    public displayAsPassword:boolean;
    public color:number;
    public autoCorrect:boolean;
    public autoCapitalize:string;

    public assignFocus():void
    {
        
    }

    public get selectionActiveIndex():number
    {
        return 0;
    }

    public get selectionAnchorIndex():number
    {
        return 0;
    }

    public set softKeyboardType(value:string)
    {

    }

    public get softKeyboardType():string
    {
        return null;
    }

    public get multiline():boolean
    {
        return true;
    }


    public set fontWeight(value:string)
    {

    }

    public get fontWeight():string
    {
        return null;
    }
    
    public set fontSize(value:number)
    {

    }

    public get fontSize():number
    {
        return 0;
    }
    
    public set maxChars(value:number)
    {

    }

    public get maxChars():number
    {
        return 0;
    }
    
    public set fontFamily(value:string)
    {

    }

    public get fontFamily():string
    {
        return null;
    }
    
    public set fontPosture(value:string)
    {

    }

    public get fontPosture():string
    {
        return null;
    }

    public set locale(value:string)
    {

    }

    public get locale():string
    {
        return null;
    }

    
    public set restrict(value:string)
    {

    }

    public get restrict():string
    {
        return null;
    }

    
    public set returnKeyLabel(value:string)
    {

    }

    public get returnKeyLabel():string
    {
        return null;
    }
    
    public set text(value:string)
    {

    }

    public get text():string
    {
        return null;
    }

    public set textAlign(value:string)
    {

    }

    public get textAlign():string
    {
        return null;
    }
}