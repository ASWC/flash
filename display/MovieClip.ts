import { FrameLabel } from './FrameLabel';
import { Timer } from './../utils/Timer';
import { Event } from './../events/Event';
import { Stage } from './Stage';
import { Sprite } from './Sprite';

export class MovieClip extends Sprite
{
    public static tint:number;
    protected movieDisplay:PIXI.Sprite;
    protected frames:string[];
    protected index: number;
    protected _frameRate:number;
    protected _startTime:number;
    protected _intervals:number;
    protected _playOnce:boolean;
    public textures: PIXI.Texture[];

    constructor()
    {
        super();        
        this.frameRate = 24;
        this._intervals = 1000 / this._frameRate;
        this.index = 0;
        this.movieDisplay = new PIXI.Sprite()
        if(MovieClip.tint)
        {
            this.movieDisplay.tint = MovieClip.tint;
        }
        this._innerCompContainer.addChild(this.movieDisplay);
    }

    public setTint(color:number):void
    {
        color = 0xFF0000
        this.movieDisplay.tint = 0xFF0000;
    }

    public destroy()
    {
        if(this.textures)
        {
            for(var i:number = 0; i < this.textures.length; i++)
            {
                this.textures[i].destroy();
            }
        }
        this.textures = null;
        this.removeChildren();
    }

    public get innerContainer():PIXI.Container
    {
        return this._innerCompContainer;
    }

    public get textureHolder():PIXI.Sprite
    {
        return this.movieDisplay;
    }

    public get frameRate():number
    {
        return this._frameRate;
    }

    public set frameRate(value:number)
    {
        if(value <= 0)
        {
            value = 24;
        }
        this._frameRate = value;
        this._intervals = 1000 / this._frameRate;
    }

    public stopAllMovieClips():void
    {

    }
    
    public gotoAndStop(frame:number):void
    {        
        frame = Math.floor(frame);
        frame -= 1;
        if(frame >= this.textures.length)
        {
            this.index = this.textures.length - 1;
        }
        else if(frame < 0)
        {
            this.index = 0;
        }
        else
        {
            this.index = frame;
        }
        this.movieDisplay.texture = this.textures[this.index];
        if(Stage.stage.hasEventListener(Event.ENTER_FRAME))
        {
            Stage.stage.removeEventListener(Event.ENTER_FRAME, this.handleEnterFrame);
        }        
    }

    private handleEnterFrame = (event:Event) =>
    {
        if(this.parent)
        {           
            this._intervals = 1000 / this._frameRate;
            if(Timer.getTimer() - (this._startTime + this._intervals) > 0)
            {
                this._startTime = Timer.getTimer();
                this.index++;
                if(this.index >= this.textures.length)
                {
                    this.index = 0;
                    if(this.hasEventListener(Event.COMPLETE))
                    {
                        this.dispatchEvent(new Event(Event.COMPLETE));
                    }  
                    if(this._playOnce)
                    {
                        this.gotoAndStop(0);
                        return;
                    }
                }
                this.movieDisplay.texture = this.textures[this.index];                
            }            
        }
    }

    public stop():void
    {
        Stage.stage.removeEventListener(Event.ENTER_FRAME, this.handleEnterFrame);   
        this.gotoAndStop(this.currentFrame);   
    }

    public playOnce():void
    {
        this.play();
        this._playOnce = true;
    }

    public play():void
    {
        if(this.parent)
        {
            this._playOnce = false;
            this._startTime = Timer.getTimer();
            Stage.stage.addEventListener(Event.ENTER_FRAME, this.handleEnterFrame);
        }
    }

    public get currentFrame():number
    {
        return this.index + 1;
    }

    public get totalFrames():number
    {
        return this.frames.length;
    }

    public get currentLabels():FrameLabel[]
    {
        return null;
    }

    public get width():number
    {
        if(this._innerCompContainer.width == null || this._innerCompContainer.width == 0)
        {
            return this.movieDisplay.width;
        }
        return this._innerCompContainer.width;
    }

    public get height():number
    {
        if(this._innerCompContainer.height == null || this._innerCompContainer.height == 0)
        {
            return this._innerCompContainer.getBounds(true, null).height;
        }
        return this._innerCompContainer.height;
    }

    public static CreateMovieClip(textures:PIXI.Texture[]):MovieClip
    {
        var movie:MovieClip = new MovieClip();
        movie.textures = textures;
        movie.frames = [];
        for (let i of Object.keys(textures))
        {
            movie.frames.push(i);
        }
        movie.frames.sort();
        movie.movieDisplay.texture = movie.textures[movie.frames[movie.index]];
        return movie;
    }
}