import { Rectangle } from '../geom/Rectangle';
import { TextLineMetrics } from './TextLineMetrics';
import { TextFieldType } from './TextFieldType';
import { TextFormat } from './TextFormat';
import { DisplayObject } from '../display/DisplayObject';

export class TextField extends DisplayObject
{
    public _embedFonts:boolean;
    public _selectable:boolean;
    public _multilines:boolean;
    public _defaultTextFormat:TextFormat;
    public locktext:boolean;
    protected _textDisplay:PIXI.Text;
    protected _backgroundWidth:number;
    protected _backgroundHeight:number;
    protected _backgroundColor:number;
    protected _borderColor:number;    
    protected _borderDisplay:PIXI.Graphics;
    protected _type:string;
    protected _text:string;
    protected _wordWrap:boolean;
    protected _textFitting:boolean;

    constructor()
    {
        super();
        this._textFitting = true;
        this.locktext = false;
        this._borderDisplay = new PIXI.Graphics();
        this._borderColor = 0;
        this._backgroundColor = 0xFFFFFF;
        this._backgroundHeight = 10;
        this._backgroundWidth = 10;
        this._defaultTextFormat = new TextFormat();
        this._textDisplay = new PIXI.Text('', this._defaultTextFormat.textStyle);  
        this._innerCompContainer.addChild(this._borderDisplay);         
        this._innerCompContainer.addChild(this._textDisplay);
        this.background = false;
        this.border = false;
        this.adjustBackground();
        this._type = TextFieldType.DYNAMIC;         
    }   

    public destroy()
    {
        if(this._borderDisplay)
        {
            this._borderDisplay.destroy();
        }
        this._borderDisplay = null;
        if(this._textDisplay)
        {
            this._textDisplay.destroy();
        }
        this._textDisplay = null;        
        this._innerCompContainer.removeChildren();
    }

    protected applyWordWrap():void
    {
        var cleanedtext:string = this._text.split("/n").join(" ");
        var words:string[] = this._text.split(" ");
        var allowedtext:string = '';
        while(words.length)
        {
            var word:string = words.shift();
            this._textDisplay.text = allowedtext + " " + word;
            if(this._textDisplay.width > this._backgroundWidth)
            {
                allowedtext += "\n" + word;
            }
            else
            {
                allowedtext += " " + word;
            }
        }
        this._textDisplay.text = allowedtext;
    }

    protected applyText():void
    {
        if(!this._text)
        {
            return;
        }
        if(!this._multilines)
        {
            if(this.locktext)
            {
                this._textDisplay.text = this._text;
            }
            else if(this._wordWrap)
            {
                this.applyWordWrap();
            }
            else
            {
                var textindex:number = 0;
                var allowedtext:string = '';
                while(textindex < this._text.length)
                {
                    var char:string = this._text.charAt(textindex);
                    this._textDisplay.text = allowedtext + char;
                    if(this._textDisplay.width > this._backgroundWidth)
                    {
                        break;
                    }
                    else
                    {
                        allowedtext += char;
                    }
                    textindex++;
                }
                this._textFitting = true;
                if(allowedtext.length < this._text.length)
                {
                    this._textFitting = false;
                }
                this._textDisplay.text = allowedtext;
            }            
        }    
        else
        {
            this._textDisplay.style.wordWrapWidth = this._backgroundWidth;            
            this._textDisplay.text = this._text;
        }            
    }

    public get isTextFitting():boolean
    {
        return this._textFitting;
    }

    public adjustTextField():void
    {         
        this.applyText()
        if(!this._multilines)
        {
            if(this._defaultTextFormat.align == 'left')
            {
                this._textDisplay.x = 0;
                this._textDisplay.y = (this._backgroundHeight / 2) - (this._textDisplay.height / 2);
            }
            else if(this._defaultTextFormat.align == 'center')
            {
                this._textDisplay.x = (this._backgroundWidth / 2) - (this._textDisplay.width / 2);
                this._textDisplay.y = (this._backgroundHeight / 2) - (this._textDisplay.height / 2);
            }
            else if(this._defaultTextFormat.align == 'right')
            {
                this._textDisplay.x = this._backgroundWidth - this._textDisplay.width;
                this._textDisplay.y = (this._backgroundHeight / 2) - (this._textDisplay.height / 2);
            }
        }  
        else
        {
            this._textDisplay.x = (this._backgroundWidth / 2) - (this._textDisplay.width / 2);
            this._textDisplay.y = (this._backgroundHeight / 2) - (this._textDisplay.height / 2);
        }     
    }

    public get height():number
    {
        return this._backgroundHeight;
    }

    public set height(value:number)
    {
        this._backgroundHeight = value;
        this.adjustBackground();       
    } 

    public get width():number
    {
        return this._backgroundWidth;
    }

    public set width(value:number)
    {
        this._backgroundWidth = value;
        this.adjustBackground();
    }

    public requestSoftKeyboard():void
    {
        
    }

    public set focusRect(value:boolean)
    {

    }

    public static isFontCompatible(fontName:string, fontStyle:string):boolean
    {
        return false;
    }

    public get needsSoftKeyboard():boolean
    {
        return true;
    }

    public set needsSoftKeyboard(value:boolean)
    {

    }

    public setTextFormat(format:TextFormat, beginIndex:number = -1, endIndex:number = -1):void
    {
        this._defaultTextFormat = format;      
        this._textDisplay.style = this.defaultTextFormat.textStyle;
        this._textDisplay.text = this._textDisplay.text;
        this._textDisplay.style.fill = this._defaultTextFormat.colorAsString;
        this.adjustTextField();
    }

    public setSelection(beginIndex:number, endIndex:number):void
    {
       
    }

    public replaceText(beginIndex:number, endIndex:number, newText:string):void
    {

    }

    public replaceSelectedText(value:string):void
    {

    }

    public getTextFormat(beginIndex:number = -1, endIndex:number = -1):TextFormat
    {
        return this._defaultTextFormat;
    }

    public getParagraphLength(charIndex:number):number
    {
        return 0;
    }

    public getLineText(lineIndex:number):string
    {
        return null;
    }

    public getLineOffset(lineIndex:number):number
    {
        return 0;
    }

    public getLineMetrics(lineIndex:number):TextLineMetrics
    {
        return null;
    }

    public getLineLength(lineIndex:number):number
    {
        return 0;
    }

    public getLineIndexOfChar(charIndex:number):number
    {
        return 0;
    }

    public getLineIndexAtPoint(x:number, y:number):number
    {
        return 0;
    }

    public getImageReference(id:string):DisplayObject
    {
        return null;
    }

    public getFirstCharInParagraph(charIndex:number):number
    {
        return 0;
    }

    public getCharIndexAtPoint(x:number, y:number):number
    {
        return 0;
    }

    public getCharBoundaries(charIndex:number):Rectangle
    {
        return null;
    }

    public appendText(value:string):void
    {
        this._text += value;       
        this.adjustTextField();
    }

    public get wordWrap():boolean
    {
        return this._wordWrap//this._textDisplay.style._wordWrap;
    }

    public set wordWrap(value:boolean)
    {
        this._wordWrap = value;
        //this._textDisplay.style._wordWrap = value;
    }

    public get useRichTextClipboard():boolean
    {
        return false;
    }

    public set useRichTextClipboard(value:boolean)
    {

    }

    public get type():string
    {
        return this._type;
    }

    public set type(value:string)
    {
        this._type = value;
    }

    public get thickness():number
    {
        return null;
    }

    public set thickness(value:number)
    {

    }

    public get textWidth():number
    {       
        return this._textDisplay.width;
    }

    public get textInteractionMode():string
    {
        return null;
    }

    public get textHeight():number
    {
        return 0;
    }

    public get textColor():number
    {
        return parseInt(this._textDisplay.style.fill.toString());
    }

    public set textColor(value:number)
    {
        this._textDisplay.style.fill = value.toString();
    }

    public set text(value:string)
    {
        this._text = value;
        this.adjustTextField();
    }

    public set filters(value:any[])
    {
        this._textDisplay.filters = value;
    }

    public get innerHeight():number
    {
        return this._textDisplay.height;
    }

    public get innerWidth():number
    {
        return this._textDisplay.width;
    }

    public get text():string
    {
        return this._textDisplay.text;
    }

    public get styleSheet():StyleSheet
    {
        return null;
    }

    public set styleSheet(value:StyleSheet)
    {

    }

    public get sharpness():number
    {
        return 0;
    }

    public set sharpness(value:number)
    {

    }

    public get selectionEndIndex():number
    {
        return 0;
    }

    public get selectionBeginIndex():number
    {
        return 0;
    }

    public get selectable():boolean
    {
        return false;
    }

    public set selectable(value:boolean)
    {

    }

    public set scrollV(value:number)
    {
        
    }
    
    public get scrollV():number
    {
        return 0;
    }

    public set scrollH(value:number)
    {
        
    }
    
    public get scrollH():number
    {
        return 0;
    }

    public set restrict(value:string)
    {

    }

    public get restrict():string
    {
        return null;
    }

    public get numLines():number
    {
        return 0;
    }

    public get multiline():boolean
    {
        return this._multilines;
    }

    public set multiline(value:boolean)
    {
        this._multilines = value;
        if(value)
        {
            this._textDisplay.style.wordWrap = true;
            //this._textDisplay.style._breakWords = true;
        }
        else
        {
            this._textDisplay.style.wordWrap = false;
            //this._textDisplay.style._breakWords = false;
        }
    }

    public set mouseWheelEnabled(value:boolean)
    {
        
    }
    
    public get mouseWheelEnabled():boolean
    {
        return false;
    }

    public get maxScrollV():number
    {
        return 0;
    }

    public get maxScrollH():number
    {
        return 0;
    }

    public get maxChars():number
    {
        return 0;
    }

    public set maxChars(value:number)
    {

    }

    public get length():number
    {
        return this._textDisplay.text.length;
    }

    public set htmlText(value:string)
    {
        this.text = value;
    }
    
    public get htmlText():string
    {
        return this.text;
    }

    public get gridFitType():string
    {
        return '';
    }

    public set gridFitType(value:string)
    {

    }

    public get embedFonts():boolean
    {
        return false;
    }

    public set embedFonts(value:boolean)
    {

    }

    public get displayAsPassword():boolean
    {
        return false;
    }

    public set displayAsPassword(value:boolean)
    {

    }

    public get defaultTextFormat():TextFormat
    {
        return this._defaultTextFormat;
    }

    public set defaultTextFormat(value:TextFormat)
    {
        this._defaultTextFormat = value;
        this._textDisplay.style = this._defaultTextFormat.textStyle;
        this._textDisplay.style.fill = this._defaultTextFormat.colorAsString;
        if(this._multilines)
        {
            this._textDisplay.style.wordWrapWidth = this._backgroundWidth;
            this._textDisplay.style.wordWrap = true;
            this._textDisplay.style.breakWords = true;
        }
        this.adjustTextField();
    }

    public get condenseWhite():boolean
    {
        return false;
    }

    public set condenseWhite(value:boolean)
    {

    }

    public get caretIndex():number
    {
        return 0;
    }

    public get bottomScrollV():number
    {
        return 0;
    }

    protected adjustBackground():void
    {
        this.graphics.clear();   
        this._borderDisplay.clear();
        this._borderDisplay.lineStyle(1, this._borderColor)     
        this.graphics.beginFill(this._backgroundColor, 1);
        this.graphics.drawRect(0, 0, this._backgroundWidth, this._backgroundHeight);
        this._borderDisplay.drawRect(0, 0, this._backgroundWidth, this._backgroundHeight);
        this.adjustTextField();
    }

    public get borderColor():number
    {
        return this._borderColor;
    }

    public set borderColor(value:number)
    {
        this._borderColor = value;
        this.adjustBackground(); 
    }

    public get border():boolean
    {
        return this._borderDisplay.visible;
    }

    public set border(value:boolean)
    {
        this._borderDisplay.visible = value;
        this.adjustBackground();   
    }

    public get backgroundColor():number
    {
        return this._backgroundColor;
    }

    public set backgroundColor(value:number)
    {
        this._backgroundColor = value;
        this.adjustBackground();        
    }

    public get background():boolean
    {
        return this.graphics.visible;
    }

    public set background(value:boolean)
    {
        this.graphics.visible = value;
    }

    public get autoSize():string
    {
        return '';
    }

    public set autoSize(value:string)
    {

    }

    public get antiAliasType():string
    {
        return '';
    }

    public set antiAliasType(value:string)
    {

    }

    public get alwaysShowSelection():boolean
    {
        return false;
    }

    public set alwaysShowSelection(value:boolean)
    {

    }    

}
