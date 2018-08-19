import { BitmapData } from './BitmapData';
import { DisplayObject } from "./DisplayObject";
import { Stage } from './Stage';

export class Bitmap extends DisplayObject
{
    protected _bitmapData:BitmapData;    
    protected _textureHolder:PIXI.Sprite;    
    
    constructor(data:BitmapData = null, auto:string = null, transparent:boolean = true)
    {
        super();
        this._bitmapData = data;
        this.interactive = false; 
        if(this._bitmapData)
        {
            var texture:PIXI.Texture = BitmapData.getTexture(this._bitmapData);
            if(texture)
            {
                this._textureHolder = new PIXI.Sprite(texture);                         
                this._innerCompContainer.addChild(this._textureHolder)
            } 
            else
            {
                this._innerCompContainer.addChild(BitmapData.getGraphics(data))
            }
        }   
    }    

    public get textureHolder():PIXI.Sprite
    {
        return this._textureHolder;
    }

    public get bitmapData():BitmapData
    {
        return this._bitmapData;
    }

    public get smoothing():boolean
    {
        return true;
    }

    public set smoothing(value:boolean)
    {

    }

    public set bitmapData(value:BitmapData)
    {
        this._bitmapData = value;
        var texture:PIXI.Texture = BitmapData.getTexture(this._bitmapData);
        if(texture)
        {
            this._textureHolder = new PIXI.Sprite(texture);                         
            this._innerCompContainer.addChild(this._textureHolder)
        } 
        else
        {
            this._innerCompContainer.addChild(BitmapData.getGraphics(this._bitmapData))
        }
    }

    public get stage():Stage
    {
        return this._stage;
    }
}