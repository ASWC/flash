import { Colour } from '../utils/Colour';

export class TextFormat
{
    protected _textStyle:PIXI.TextStyle;
    protected _color:number;
    protected _colourTranscript:Colour;

    constructor(font:string = null, size:Object = null, color:number = null, 
                bold:Object = null, italic:Object = null, underline:Object = null, 
                url:string = null, target:string = null, align:string = null, 
                leftMargin:Object = null, rightMargin:Object = null, 
                indent:Object = null, leading:Object = null)
    {
        this._color = 0;
        if(color)
        {
            this._color = color;
        }
        this._textStyle = new PIXI.TextStyle({});
        this._textStyle.align = "left";
        this._textStyle.dropShadow = false;
        this._textStyle.dropShadowAngle = 0;
        this._textStyle.dropShadowBlur = 0;
        this._textStyle.dropShadowColor = 0;
        this._textStyle.dropShadowDistance = 0;
        this._textStyle.fill = 'black';
        this._textStyle.fillGradientType = 0;
        this._textStyle.fontFamily = 'Lato';
        this._textStyle.fontSize = 16;
        this._textStyle.fontStyle = 'normal';
        this._textStyle.fontVariant = 'normal';
        this._textStyle.fontWeight = 'normal';
        this._textStyle.letterSpacing = 0;
        this._textStyle.lineHeight = 0;
        this._textStyle.lineJoin = '0';
        this._textStyle.miterLimit = 0;
        this._textStyle.padding = 0;
        this._textStyle.stroke = 'black';
        this._textStyle.strokeThickness = 0;
        this._textStyle.textBaseline = 'alphabetic';
        this._textStyle.wordWrap = false;
        this._textStyle.wordWrapWidth = 100;



        
    }

    public get textStyle():PIXI.TextStyle
    {
        return this._textStyle;
    }

    public get size():number
    {
        return parseFloat(this._textStyle.fontSize.toString());
    }

    public set size(value:number)
    {
        this._textStyle.fontSize = value;
    }

    public get italic():boolean
    {
        if(this._textStyle.fontStyle == 'italic')
        {
            return true;
        }
        return false;
    }

    public set italic(value:boolean)
    {
        if(value)
        {
            this._textStyle.fontStyle = 'italic';
        }
        else
        {
            this._textStyle.fontStyle = 'normal';
        }
    }  

    public get align():string
    {
        return this._textStyle.align;
    }

    public set align(value:string)
    {
        this._textStyle.align = value;
    }

    public get blockIndent():Object
    {
        return null;
    }

    public set blockIndent(value:Object)
    {

    }

    public get bold():boolean
    {
        if(this._textStyle.fontWeight == 'bold')
        {
            return true;
        }
        return false;
    }

    public set bold(value:boolean)
    {
        if(value)
        {
            this._textStyle.fontWeight = 'bold';
        }
        else
        {
            this._textStyle.fontWeight = 'normal';
        }
    }

    public get font():string
    {
        return this._textStyle.fontFamily.toString();
    }

    public set font(value:string)
    {
        this._textStyle.fontFamily = value;
    } 

    public get color():number
    {
        return this._color;
    }

    public get colorAsString():string
    {
        var convertedColor:string = this.color.toString(16).replace('0x', '');        
        if(convertedColor.length < 6)
        {
            convertedColor = '0' + convertedColor;
        }
        if(!this._colourTranscript)
        {
            this._colourTranscript = new Colour(this.color);
        }
        return this._colourTranscript.toWebRGB;
    }

    public set color(value:number)
    {
        this._color = value;
    }

    public get bullet():Object
    {
        return null;
    }

    public set bullet(value:Object)
    {

    }

    public get indent():Object
    {
        return null;
    }

    public set indent(value:Object)
    {

    }

    public get kerning():Object
    {
        return null;
    }

    public set kerning(value:Object)
    {

    }
      
    public get leading():Object
    {
        return null;
    }

    public set leading(value:Object)
    {

    }
       
    public get letterSpacing():Object
    {
        return null;
    }

    public set letterSpacing(value:Object)
    {

    }

    public get rightMargin():Object
    {
        return null;
    }

    public set rightMargin(value:Object)
    {

    }

    

    
}