import { PNGEncoderOptions } from './PNGEncoderOptions';
import { ByteArray } from '../utils/ByteArray';
import { ColorTransform } from '../geom/ColorTransform';
import { Matrix } from '../geom/Matrix';
import { IBitmapDrawable } from './IBitmapDrawable';
import { BitmapFilter } from '../filters/BitmapFilter';
import { Point } from '../geom/Point';
import { Colour } from '../utils/Colour';
import { Graphics } from './Graphics';
import { Rectangle } from '../geom/Rectangle';

export class BitmapData
{
    protected _transparent:boolean;
    protected _rect:Rectangle;
    protected _innergraphic:Graphics;
    protected _texture:PIXI.Texture;
    protected _canvasDraw;
    protected _canvasContext;
    public colorControl:Colour;    
    public _debugName:string;

    constructor(width:number, height:number, transparent:boolean, color:number)
    {
        this.colorControl = new Colour(color);
        this._innergraphic = new Graphics();     
        if(transparent)
        {
            this._innergraphic.beginFill(this.colorControl.plainColor, this.colorControl.absoluteAlpha);
        }   
        else
        {
            this._innergraphic.beginFill(this.colorControl.plainColor);
        }        
        this._innergraphic.drawRect(0, 0, width, height);
        this.transparent = transparent;
        this._rect = new Rectangle();
        this._rect.width = width;
        this._rect.height = height;        
    }

    public debug(name:string):void
    {
        this._debugName = name;
    }

    public applyFilter(sourceBitmapData:BitmapData, sourceRect:Rectangle, destPoint:Point, filter:BitmapFilter):void
    {

    }

    public paletteMap(sourceBitmapData:BitmapData, sourceRect:Rectangle, destPoint:Point, redArray:any[] = null, greenArray:any[] = null, blueArray:any[] = null, alphaArray:any[] = null):void
    {

    }

    public getPixel32(x:number, y:number):number
    {        
        if(!this._canvasDraw)
        {
            this._canvasDraw = document.createElement('canvas');
            this._canvasDraw.width = this._texture.width;
            this._canvasDraw.height = this._texture.height;
            this._canvasContext = this._canvasDraw.getContext("2d");
            this._canvasContext.drawImage(this._texture.baseTexture.source, 0, 0);            
        }
        if(this._canvasContext)
        {
            var data = this._canvasContext.getImageData(x, y, 1, 1).data;
            if(data)
            {
                return data[0];
            }            
        }
        return 1;
    }



    public clone():BitmapData
    {
        var data:BitmapData = new BitmapData(this._rect.width, this._rect.height, this.transparent, this.colorControl.color);
        data._texture = this._texture;
        return data;
    }

    public draw(source:IBitmapDrawable, matrix:Matrix = null, colorTransform:ColorTransform = null, blendMode:string = null, clipRect:Rectangle = null, smoothing:boolean = false):void
    {

    }

    public static setTexture(texture:PIXI.Texture):BitmapData
    {
        var data:BitmapData = new BitmapData(texture.width, texture.height, true, 0);
        data._innergraphic = null;
        data._texture = texture;  
        return data;
    }

    public static getTexture(data:BitmapData):PIXI.Texture
    {
        return data._texture;
    }

    public static getGraphics(data:BitmapData):Graphics
    {
        return data._innergraphic;
    }

    public floodFill(x:number, y:number, color:number):void
    {
        if(this._innergraphic)
        {
            this.colorControl.color = color;
            this._innergraphic.clear();
            if(this.transparent)
            {
                this._innergraphic.beginFill(this.colorControl.plainColor, this.colorControl.absoluteAlpha);
            }   
            else
            {
                this._innergraphic.beginFill(this.colorControl.plainColor);
            } 
            this._innergraphic.drawRect(0, 0, this.rect.width, this.rect.height);
        }
    }

    public colorTransform(rect:Rectangle, colorTransform:ColorTransform):void
    {
        
    }

    public encode(area:Rectangle, options:PNGEncoderOptions):ByteArray
    {
        return null;
    }

    public get rect():Rectangle
    {
        return this._rect;
    }

    public set rect(value:Rectangle)
    {
        this._rect = value;
    }

    public copyPixels(data:BitmapData, area:Rectangle, position:Point)
    {

    }

    public set transparent(value:boolean)
    {
        this._transparent = value;
    }

    public get transparent():boolean
    {
        return this._transparent;
    }   

    public fillRect(rect:Rectangle, color:number):void
    {

    }

    public drawWithQuality(source:IBitmapDrawable, matrix:Matrix = null, colorTransform:ColorTransform = null, blendMode:string = null, clipRect:Rectangle = null, smoothing:boolean = false, quality:string = null):void
    {

    }

    public dispose():void
    {
        if(this._innergraphic)
        {
            this._innergraphic.destroy();
        }
        if(this._texture)
        {
            this._texture.destroy();
        }
        this._innergraphic = null;
        this._texture = null;
        this.colorControl = null;
    }

    public set width(value:number)
    {

    }

    public set height(value:number)
    {

    }

    public get width():number
    {
        if(this._texture)
        {
            this._texture.width;
        }
        if(this._innergraphic)
        {
            this._innergraphic.width;
        }
        return this._rect.width;
    }

    public get height():number
    {
        if(this._texture)
        {
            this._texture.height;
        }
        if(this._innergraphic)
        {
            this._innergraphic.height;
        }
        return this._rect.height;
    }
}