import { Event } from './Event';

export class KeyBoardEvent extends Event
{
    public static KEYBOARD_DOWN:string = "keydown";
    public static KEYBOARD_UP:string = "keyup";
    public static KEYBOARD_PRESS:string = "keypress";
    public static KEY_DOWN:string = "keyDown";
    public static KEY_UP:string = "keyUp";    

    protected _charCode:number;
    protected _key:string;
    protected _altKey:boolean;
    protected _commandKey:boolean;
    protected _controlKey:boolean;
    protected _ctrlKey:boolean;
    protected _keyCode:number;
    protected _keyLocation:number;
    protected _shiftKey:boolean;

    constructor(type:string, bubble:boolean = true, cancelable:boolean = true)
    {
        super(type, bubble, cancelable);
        this._charCode = 0;
        this._key = '';
        this._altKey = false;
        this._commandKey = false;
        this._controlKey = false;
        this._ctrlKey = false;
        this._keyCode = 0;
        this._keyLocation = 0;
        this._shiftKey = false;
    }

    public set shiftKey(value:boolean)
    {
        this._shiftKey = value;
    }

    public get shiftKey():boolean
    {
        return this._shiftKey;
    }

    public set keyLocation(value:number)
    {
        this._keyLocation = value;
    }

    public get keyLocation():number
    {
        return this._keyLocation;
    }

    public set keyCode(value:number)
    {
        this._keyCode = value;
    }

    public get keyCode():number
    {
        return this._keyCode;
    }

    public set ctrlKey(value:boolean)
    {
        this._ctrlKey = value;
    }

    public get ctrlKey():boolean
    {
        return this._ctrlKey;
    }

    public set controlKey(value:boolean)
    {
        this._controlKey = value;
    }

    public get controlKey():boolean
    {
        return this._controlKey;
    }

    public set commandKey(value:boolean)
    {
        this._commandKey = value;
    }

    public get commandKey():boolean
    {
        return this._commandKey;
    }

    public set charCode(value:number)
    {
        this._charCode = value;    
    }

    public get charCode():number
    {
        return this._charCode;
    }

    public get key():string
    {
        return this._key;
    }

    public set key(value:string)
    {
        this._key = value;
    }

    public get altKey():boolean
    {
        return this._altKey;
    }

    public set altKey(value:boolean)
    {
        this._altKey = value;    
    }
}