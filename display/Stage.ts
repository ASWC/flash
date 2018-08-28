import { Tween } from './../utils/tweens/Tween';
import { Event } from './../events/Event';
import { Capabilities } from './../system/Capabilities';
import { Rectangle } from './../geom/Rectangle';
import { TextFieldType } from './../text/TextFieldType';
import { TextField } from './../text/TextField';
import { StageDisplayState } from './StageDisplayState';
import { Timer } from './../utils/Timer';
import { FullScreenEvent } from './../events/FullScreenEvent';
import { KeyBoardEvent } from './../events/KeyBoardEvent';
import { DisplayObject } from './DisplayObject';
import { Point } from './../geom/Point';
import { IRateDelegate } from './../utils/IRateDelegate';
import { Sprite } from './Sprite';
import { Tracer } from '../../superduperinc/flash/log/Tracer';
import { MouseEvent } from '../events/MouseEvent';
import * as screenfull from "screenfull";

export class Stage extends Sprite implements IRateDelegate
{    
    public static pageScrollMode:boolean = false;
    public static absoluteMousePosition:Point = new Point();
    public static absoluteX:number = 0;
    public static absoluteY:number = 0;
    public static _mouseX:number = 0;
    public static _mouseY:number = 0;
    public static RENDERERTYPE:number = 0;
    private static _stageInstance:Stage;
    private static _frameEvent:Event;
    private static _resizeEvent:Event;
    private static _renderEvent:Event;
    protected _canvasName:string;
    protected _initialized:boolean;
    protected _requireRender:boolean;
    protected options:StageOptions;
    protected canvasElement:HTMLCanvasElement;
    protected renderer:PIXI.SystemRenderer;
    protected _focusedObject:DisplayObject;
    private _keyboardEvent:KeyBoardEvent;
    private _fullscreenEvent:FullScreenEvent;
    protected _currentDisplayState:string;
    protected _canvasCachedWidth:number;
    protected _canvasCachedHeight:number;
    //protected _canvasImageExtractor:PIXI.WebGLExtract;
    protected _animationRequest:boolean;
    protected _animationRate:number;
    protected _stageScale:number;
    protected _pageInitialPosition:number;
    protected _mouseInitialPosition:number;
    protected _totalPageDistance:number;
    protected _fullScreenWidth:number;
    protected _fullScreenHeight:number;
    protected _userActivity:boolean;

    constructor()
    {
        super();
        this._userActivity = true;
        this._fullScreenHeight = 0;
        this._fullScreenWidth = 0;
        this._stageScale = 1;
        this._animationRequest = true;
        this._requireRender = false;
        this._canvasName = 'StageCanvas';
        this._stage = this;
        this.options = new StageOptions();
        Timer.getTimer();      
        document.onkeydown = this.handleKeyDown; 
        document.onkeyup = this.handleKeyUp; 
        this._keyboardEvent = new KeyBoardEvent(KeyBoardEvent.KEY_DOWN)
        this._fullscreenEvent = new FullScreenEvent(FullScreenEvent.FULL_SCREEN);
        this._currentDisplayState = StageDisplayState.NORMAL;    
        this.addEventListener(MouseEvent.MOUSE_DOWN, this.handleStageMouseDown)   
        this.addEventListener(MouseEvent.MOUSE_MOVE, this.handleStageMouseMove) 
    }

    protected setAutoResize():void
    {
        window.addEventListener("resize", this.handleResize)
        this.handleResize(null);
    }

    private handleResize = (event)=>
    {
        var w:number = window.innerWidth;
        var h:number = window.innerHeight;
        if(this.canvasElement)
        {
            this.canvasElement.width = w;
            this.canvasElement.height = h;
            //this.resizeCanvas(w, h);            
        }
    }

    protected handleStageMouseMove = (event:MouseEvent)=>
    {
        this._userActivity = true;
    }

    protected handleStageMouseDown = (event:MouseEvent)=>
    {
        this._userActivity = true;
        if(this.dragging)
        {
            return;
        }
        if(this._currentDisplayState != StageDisplayState.NORMAL)
        {
            return;
        }
        var downtarget:DisplayObject = event.target;
        if(downtarget)
        {
            if(!downtarget.allowDragging)
            {
                this.startDrag();
                this.addEventListener(MouseEvent.MOUSE_UP, this.handleStageDragOver);        
            }
        }
    }

     private handleStageDragOver = (event:MouseEvent)=> 
    {
        this.stopDrag();
        this.removeEventListener(MouseEvent.MOUSE_UP, this.handleStageDragOver);     
    }

    public startDrag(lockCenter:boolean = false, bounds:Rectangle = null):void
    {        
        if(this._cachedData)
        {
            if(this._cachedData.originalEvent)
            {
                if(this._cachedData.originalEvent['y'] != undefined)
                {
                    this.dragging = true;
                    this._pageInitialPosition = window.pageYOffset;
                    this._mouseInitialPosition = this._cachedData.originalEvent['y'];
                    this._totalPageDistance = this._pageInitialPosition + this._mouseInitialPosition;
                    this.addEventListener(MouseEvent.MOUSE_MOVE, this.handlePageMove)
                }
                else if(this._cachedData.originalEvent['touches'][0]['clientY'])
                {
                    this.dragging = true;
                    this._pageInitialPosition = window.pageYOffset;
                    this._mouseInitialPosition = this._cachedData.originalEvent['touches'][0]['clientY'] - this._pageInitialPosition;
                    this._totalPageDistance = this._pageInitialPosition + this._mouseInitialPosition;
                    this.addEventListener(MouseEvent.MOUSE_MOVE, this.handlePageMove)
                }
                else
                {
                    Tracer.reveal(this._cachedData.originalEvent)
                }
            }
        }
    }

    private handlePageMove = (event:MouseEvent)=>
    {
        if(this.dragging)
        {
            if(this._cachedData.originalEvent['y'] != undefined)
            {
                let newpos:number = this._totalPageDistance - event.data.originalEvent['y'];
                window.scrollTo(0, newpos)
            }
            else if(this._cachedData.originalEvent['touches'][0]['clientY'])
            {
                let newpos:number = this._totalPageDistance - (this._cachedData.originalEvent['touches'][0]['clientY'] - this._pageInitialPosition);
                window.scrollTo(0, newpos)
            }
        }
    }

    public stopDrag():void
    {
        this.dragging = false;
        this.removeEventListener(MouseEvent.MOUSE_MOVE, this.handlePageMove)
    }

    public get stageScale():number
    {
        return this._stageScale;
    }

    public set stageScale(value:number)
    {
        this._stageScale = value;
    }

    public getCanvasElement():HTMLCanvasElement
    {
        return this.canvasElement;
    }

    public getObjectUnderMouse():DisplayObject
    {        
        return Stage.getObjectUnderMouse();
    }

    public static getObjectUnderMouse():DisplayObject
    {
        var target:DisplayObject = Stage._stageInstance.getChildrenUnderMouse();
        if(target)
        {
            return target;
        }        
        return Stage._stageInstance;
    }

    private handleKeyDown = (event) =>
    {        
        if(this._focusedObject)
        {
            var field:TextField = <TextField> this._focusedObject;
            if(field)
            {
                if(field.type == TextFieldType.INPUT)
                {
                    if(event.keyCode <= 32)
                    {
                        if(event.keyCode == 8)
                        {
                            var textvalue:string = field.text;
                            if(textvalue.length)
                            {
                                textvalue = textvalue.substr(0, textvalue.length - 1)
                                field.text = textvalue;
                            }
                        }
                    }
                    else
                    {
                        field.text += event.key;
                    }                    
                }
            }
            this._keyboardEvent.type = KeyBoardEvent.KEY_DOWN;
            this._keyboardEvent.key = event.key;
            this._keyboardEvent.keyCode = event.keyCode;
            this._keyboardEvent.altKey = event.altKey;
            this._keyboardEvent.ctrlKey = event.ctrlKey;
            this._keyboardEvent.metaKey = event.metaKey;
            this._keyboardEvent.shiftKey = event.shiftKey;
            this.dispatchEvent(this._keyboardEvent);
        }        
    }

    private handleKeyUp = (event) =>
    {
        if(this._focusedObject)
        {
            this._keyboardEvent.type = KeyBoardEvent.KEY_UP;
            this._keyboardEvent.key = event.key;
            this._keyboardEvent.keyCode = event.keyCode;
            this._keyboardEvent.altKey = event.altKey;
            this._keyboardEvent.ctrlKey = event.ctrlKey;
            this._keyboardEvent.metaKey = event.metaKey;
            this._keyboardEvent.shiftKey = event.shiftKey;
            this.dispatchEvent(this._keyboardEvent);
        }        
    }

    public set focus(value:DisplayObject)
    {
        this._focusedObject = value;
    }

    public static takeScreenShot(target:DisplayObject):HTMLImageElement
    {
        // if(Stage._stageInstance.renderer["extract"])
        // {
        //     var extract:PIXI.WebGLExtract = Stage._stageInstance.renderer["extract"];
        //     var imageurl:HTMLImageElement = extract.image(target._innerCompContainer);
        //     return imageurl;
        // }
        return null;
    }

    public get softKeyboardRect():Rectangle
    {
        return null;
    }
    
    public get stageHeight():number
    {
        if(this.renderer)
        {
            return this.renderer.height;
        }
        return 0;
    }

    public get stageWidth():number
    {
        if(this.renderer)
        {
            return this.renderer.width;
        }
        return 0;
    }

    protected createStage(stageWidth:number, stageHeight:number):void
    {

    }

    public static hideCursor():void
    {
        if(Stage.stage)
        {
            if(Stage.stage.canvasElement)
            {
                Stage.stage.canvasElement.style.cursor = "none";
            }
        }
    }

    public static showCursor():void
    {
        if(Stage.stage)
        {
            if(Stage.stage.canvasElement)
            {
                Stage.stage.canvasElement.style.cursor = "inherit";
            }
        }
    }

    protected connectToStage(viewName:string = null):void
    {
        if(viewName)
        {
            this.name = viewName;
            this.canvasElement = document.getElementById(viewName) as HTMLCanvasElement;
        }
        else
        {
            this.name = this._canvasName;
            this.canvasElement = document.getElementById(this._canvasName) as HTMLCanvasElement;
        }
        if(this.canvasElement)
        {           
            this.canvasElement.style.backgroundColor = "white";
            Stage._mouseX = 0;
            Stage._mouseY = 0; 
            if(Capabilities.isOnMobile)
            {
                this.canvasElement.ontouchstart = function(e){Stage.checkMousePosition(e)};
                this.canvasElement.ontouchmove = function(e){Stage.checkMousePosition(e)};
            }
            else
            {
                this.canvasElement.onmousemove = function(e){Stage.checkMousePosition(e)};
            }            
            this.options.setView(this.canvasElement);
			if (Stage.isInternetExplorer())
			{
                if(Stage.getInternetExplorerVersion() == 11)
                {
                    this.renderer = new PIXI.WebGLRenderer(this.options.stageWidth, this.options.stageHeight, this.options)
                }
                else
                {
                    this.renderer = new PIXI.CanvasRenderer(this.options.stageWidth, this.options.stageHeight, this.options)
                }
            }
            else
            {
                this.renderer = new PIXI.WebGLRenderer(this.options.stageWidth, this.options.stageHeight, this.options)
            }           
            Stage.RENDERERTYPE = this.renderer.type;
            this._canvasCachedWidth = this.canvasElement.width;
            this._canvasCachedHeight = this.canvasElement.height;
            Stage._stageInstance = this;
            Timer.rateDelegate = this;
            Stage.enterFrame();
        }
    }

    public getPixels(target):any
    {
        var TEMP_RECT = new PIXI.Rectangle();
        const renderer = this.renderer;
        let textureBuffer;
        let resolution;
        let frame;
        let renderTexture;
        let generated = false;
        if (target)
        {
            if (target instanceof PIXI.RenderTexture)
            {
                renderTexture = target;
            }
            else
            {
                renderTexture = this.renderer.generateTexture(target, 1, 1);
                generated = true;
            }
        }
        if (renderTexture)
        {
            textureBuffer = renderTexture.baseTexture._glRenderTargets[this.renderer['CONTEXT_UID']];
            resolution = textureBuffer.resolution;
            frame = renderTexture.frame;
        }
        else
        {
            textureBuffer = this.renderer['rootRenderTarget'];
            resolution = textureBuffer.resolution;
            frame = TEMP_RECT;
            frame.width = textureBuffer.size.width;
            frame.height = textureBuffer.size.height;
        }

        const width = frame.width * resolution;
        const height = frame.height * resolution;

        const webglPixels = new Uint8Array(4 * width * height);

        if (textureBuffer)
        {
            // bind the buffer
            this.renderer['bindRenderTarget'](textureBuffer);
            // read pixels to the array
            const gl = renderer['gl'];

            gl.readPixels(
                frame.x * resolution,
                frame.y * resolution,
                width,
                height,
                gl.RGBA,
                gl.UNSIGNED_BYTE,
                webglPixels
            );
        }

        if (generated)
        {
            renderTexture.destroy(true);
        }

        return webglPixels;
    }

    public getPixelData(texture:PIXI.RenderTexture):any
    {
        // if(this._canvasImageExtractor)
        // {
        //     return this._canvasImageExtractor.pixels(texture);
        // }
        return null;
    }

    public getParameters():Object
    {
        var result:Object = {};
        if(this.canvasElement)
        {
            for(var key in this.canvasElement)
            {
                result[key] = this.canvasElement[key];
            }
        }
        return result;
    }

    public get mouseX():number
    {
        return Stage._mouseX;
    }

    public get mouseY():number
    {
        return Stage._mouseY;
    }

    private static checkMousePosition(event:any)
    {
        try
        {
            Stage._mouseX = event.pageX - Stage.absoluteX;
            Stage._mouseY = event.pageY - Stage.absoluteY;
        }
        catch(e)
        {
            
        }        
    }

    public moveCanvas(posX: number, posY: number)
    {
        if(this.canvasElement)
        {
            
        }
    }

    public resizeCanvas(newWidth: number, newheight: number)
    {
        this.renderer.resize(newWidth, newheight);
        if(this.canvasElement)
        {
            
        }
    }

    protected run()
    {

    }

    private render():void
    {
        if(this._requireRender)
        {
            if(!Stage._renderEvent)
            {
                Stage._renderEvent = new Event(Event.RENDER);
            }            
            Stage._stageInstance.dispatchEvent(Stage._renderEvent);
        }
        this.renderer.render(this._innerCompContainer);        
    }

    public setFrameRate(rate:number):void
    {
        if(rate >= 60)
        {
            this._animationRequest = true;
        }
        else
        {
            this._animationRequest = false;
            this._animationRate = rate;
        }
    }

    protected static enterFrame():void
    {
        if(Stage._stageInstance._animationRequest)
        {
            requestAnimationFrame(Stage.enterFrame);
        }
        else
        {
            setTimeout(function() 
            {
                requestAnimationFrame(Stage.enterFrame);
            }, 1000 / Stage._stageInstance._animationRate);
        }
        Stage._stageInstance.render();
        if(!Stage._frameEvent)
        {
            Stage._frameEvent = new Event(Event.ENTER_FRAME);
            Stage._frameEvent.currentTarget = Stage._stageInstance;
        }
        Stage._stageInstance.dispatchEvent(Stage._frameEvent);
        Stage._stageInstance.run();
        Timer.runTimers();  
        Tween.runTweens();
        Stage.calculatePosition();
        Stage.checkResize();
    }

    public onStableRate(rate:number):void
    {
        
    }

    protected adjustCanvas():void
    {
        this.renderer.resize(Stage._stageInstance.canvasElement.width, Stage._stageInstance.canvasElement.height)
        this._canvasCachedWidth = Stage._stageInstance.canvasElement.width;
        this._canvasCachedHeight = Stage._stageInstance.canvasElement.height;     
        if(!Stage._resizeEvent)
        {
            Stage._resizeEvent = new Event(Event.RESIZE);
            Stage._stageInstance.dispatchEvent(Stage._resizeEvent);
        }  
    }

    private static checkResize():void
    {
        if(Stage._stageInstance._canvasCachedWidth != Stage._stageInstance.canvasElement.width)
        {
            Stage._stageInstance.adjustCanvas();
        }
        else if(Stage._stageInstance._canvasCachedHeight != Stage._stageInstance.canvasElement.height)
        {
            Stage._stageInstance.adjustCanvas();
        }
        else if(Stage._stageInstance._canvasCachedWidth != Stage._stageInstance.renderer.width)
        {
            
        }
    }     

    private static calculatePosition():void
    {
        if(Stage._stageInstance.canvasElement)
        {
            var element:any = Stage._stageInstance.canvasElement;
            var top = 0, left = 0;
            do 
            {
        	    top += element.offsetTop  || 0;
        	    left += element.offsetLeft || 0;
        	    element = element.offsetParent;
    	    } while(element);
            Stage.absoluteX = left;
            Stage.absoluteY = top;
        }
    }

    public get absoluteX():number
    {
        return Stage.absoluteX;
    }

    public get absoluteY():number
    {
        return Stage.absoluteY;
    }

    public get initialized():boolean
    {
        return this._initialized;
    }

    public set transparentStage(value:boolean)
    {
        this.options.transparent = value;
    }

    public set useAntiAlias(value:boolean)
    {
        this.options.antialias = value;
    }

    public set stageColor(value:number)
    {
        if(this.renderer)
        {
            this.renderer.backgroundColor = value;
        }
    }

    public invalidate():void
    {
        this._requireRender = true;
    }

    public set align(value:string)
    {

    }

    public set scaleMode(value:string)
    {

    }

    public static get stage():Stage
    {
        return Stage._stageInstance;
    }

    public get displayState():string
    {
        return this._currentDisplayState;
    }

    public set displayState(value:string)
    {
        if(value == this._currentDisplayState)
        {
            return;
        }
        if(value == StageDisplayState.FULL_SCREEN && this._currentDisplayState == StageDisplayState.FULL_SCREEN_INTERACTIVE)
        {
            this._currentDisplayState = value;
            return;
        }
        if(value == StageDisplayState.FULL_SCREEN_INTERACTIVE && this._currentDisplayState == StageDisplayState.FULL_SCREEN)
        {
            this._currentDisplayState = value;
            return;
        }      
        this._currentDisplayState = value;  
        if(this._currentDisplayState == StageDisplayState.NORMAL)
        {
            this.exitFullScreen();
        }
        else
        {
            this.enterFullScreen();
        }
    }

    private enterFullScreen():void
    {
        if (window['screen'])
        {
            var sceen = window['screen'];
            this._fullScreenWidth = sceen['availWidth'] as number;
            this._fullScreenHeight = sceen['availHeight'] as number;
            this.resizeCanvas(this._fullScreenWidth, this._fullScreenHeight);
        }      
        screenfull.on('change', this.handleDisplatStateChange)
        screenfull.request(this.options.view);
        this.initEscapeFullScreenCheck();
    }

    private initEscapeFullScreenCheck():void
    {
        document.addEventListener('fullscreenchange', this.checkFullScreenElement);
        document.addEventListener('webkitfullscreenchange', this.checkFullScreenElement);
        document.addEventListener('mozfullscreenchange', this.checkFullScreenElement);
        document.addEventListener('MSFullscreenChange', this.checkFullScreenElement);
    }

    private getFullScreenElement():Element
    {
        var fullscreenElement = document['fullscreenElement'];
        if(fullscreenElement != undefined || fullscreenElement != null)
        {
            return fullscreenElement;
        }
        fullscreenElement = document['webkitFullscreenElement']
        if(fullscreenElement != undefined || fullscreenElement != null)
        {
            return fullscreenElement;
        }
        fullscreenElement = document['mozFullscreenElement']
        if(fullscreenElement != undefined || fullscreenElement != null)
        {
            return fullscreenElement;
        }
        fullscreenElement = document['msFullscreenElement'];
        if(fullscreenElement != undefined || fullscreenElement != null)
        {
            return fullscreenElement;
        }
        return null;
    }

    private checkFullScreenElement = (event)=>
    {
        document.removeEventListener('fullscreenchange', this.checkFullScreenElement);
        document.removeEventListener('webkitfullscreenchange', this.checkFullScreenElement);
        document.removeEventListener('mozfullscreenchange', this.checkFullScreenElement);
        document.removeEventListener('MSFullscreenChange', this.checkFullScreenElement);
        let fullscreenElement = this.getFullScreenElement();
        if(fullscreenElement)
        {
            document.addEventListener('fullscreenchange', this.escapeFullScreenListener);
            document.addEventListener('webkitfullscreenchange', this.escapeFullScreenListener);
            document.addEventListener('mozfullscreenchange', this.escapeFullScreenListener);
            document.addEventListener('MSFullscreenChange', this.escapeFullScreenListener);
        }
    }

    private escapeFullScreenListener = (event)=>
    {
        document.removeEventListener('fullscreenchange', this.escapeFullScreenListener);
        document.removeEventListener('webkitfullscreenchange', this.escapeFullScreenListener);
        document.removeEventListener('mozfullscreenchange', this.escapeFullScreenListener);
        document.removeEventListener('MSFullscreenChange', this.escapeFullScreenListener);
        if(this._currentDisplayState == StageDisplayState.FULL_SCREEN || this._currentDisplayState == StageDisplayState.FULL_SCREEN_INTERACTIVE)
        {
            this._currentDisplayState = StageDisplayState.NORMAL;
            this.exitFullScreen();
        }
    }

    private exitFullScreen():void
    {
        document.removeEventListener('fullscreenchange', this.escapeFullScreenListener);
        document.removeEventListener('webkitfullscreenchange', this.escapeFullScreenListener);
        document.removeEventListener('mozfullscreenchange', this.escapeFullScreenListener);
        document.removeEventListener('MSFullscreenChange', this.escapeFullScreenListener);
        this.resizeCanvas(this.options.stageWidth, this.options.stageHeight);   
        screenfull.on('change', this.handleDisplatStateChange)
        screenfull.exit();
    }

    private handleDisplatStateChange = (event)=>
    {
        screenfull.off('change', this.handleDisplatStateChange);
        Stage._stageInstance.dispatchEvent(Stage._stageInstance._fullscreenEvent); 
    }

    public get allowsFullScreen():boolean
    {
        return screenfull.enabled;
    }

    public get fullScreenHeight():number
    {
        return this._fullScreenHeight;
    }

    public get fullScreenWidth():number
    {
        return this._fullScreenWidth;
    }

    protected static getInternetExplorerVersion():number
    {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE ');
        if (msie > 0) 
        {
            // IE 10 or older => return version number
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);            
        }
        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            var rv = ua.indexOf('rv:');
            return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);           
        }
        return 0;
    }

    protected static isInternetExplorer():boolean
    {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE ');
        if (msie > 0) 
        {
            // IE 10 or older => return version number
            //return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
            return true;
        }
        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            //var rv = ua.indexOf('rv:');
            //return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
            return true;
        }
        return false;
    }
    
}


class StageOptions implements PIXI.RendererOptions
{
    public view:HTMLCanvasElement;
    public transparent:any;
    public antialias:boolean;
    public autoResize:boolean;
    public resolution:number;
    public clearBeforeRendering:boolean;
    public preserveDrawingBuffer:boolean;
    public forceFXAA:boolean;
    public roundPixels:boolean;
    public backgroundColor:number;
    public canvasMode:boolean;
    public webGlMode:boolean;
    public stageWidth:number;
    public stageHeight:number;
    public fullscreenWidth:number;
    public fullscreenHeight:number;
    //public premultipliedAlpha:boolean;

    constructor()
   {
       //this.premultipliedAlpha = true;
       this.stageHeight = 768;
       this.stageWidth = 1024;
       this.webGlMode = true;
       this.view = null;
       this.transparent = true;
       this.antialias = true;
       this.autoResize = true;
       this.clearBeforeRendering = true;
       this.preserveDrawingBuffer = true;
       this.roundPixels = true;
       this.backgroundColor = 0x000000;
       this.fullscreenWidth = 0;
       this.fullscreenHeight = 0;
   }

   public setView(view:HTMLCanvasElement):void
   {
       this.view = view;
       this.stageHeight = this.view.height;
       this.stageWidth = this.view.width;
   }
}