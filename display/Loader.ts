import { MovieClip } from './MovieClip';
import { BitmapData } from './BitmapData';
import { Bitmap } from './Bitmap';
import { IOErrorEvent } from './../events/IOErrorEvent';
import { Event } from './../events/Event';
import { ProgressEvent } from './../events/ProgressEvent';
import { LoaderContext } from './../system/LoaderContext';
import { URLRequest } from './../net/URLRequest';
import { DisplayObject } from './DisplayObject';
import { LoaderInfo } from './LoaderInfo';
import { EventDispatcher } from './../events/EventDispatcher';

export class Loader extends EventDispatcher
{
    protected _loaderInfo:LoaderInfo;
    protected _content:DisplayObject;
    protected pixiloader:PIXI.loaders.Loader;
    protected _loadFailed:boolean;
    protected _request:URLRequest;

    constructor()
    {
        super();
        this._loaderInfo = new LoaderInfo();
    }

    public unloadAndStop(gc:boolean = true):void
    {

    }

    public loadBytes(bytes:any, context:LoaderContext = null)
    {

    }

    public load(request:URLRequest, context:LoaderContext = null):void
    {
        this._request = request;
        this.pixiloader = new PIXI.loaders.Loader();  
        this.pixiloader.on('progress', this.onProgress)
        this.pixiloader.once('complete', this.onComplete)
        this.pixiloader.once('error', this.onError)
        this.pixiloader.add(request.url, {crossOrigin: 'anonymous'});            
        this.pixiloader.load();  
    }

    protected onError = (result:any) =>
    {
        this._loadFailed = true;
    }

    protected onProgress = (result:any) =>
    {        
        if(this._loadFailed)
        {
            return;
        }
        var progressEvent:ProgressEvent = new ProgressEvent(ProgressEvent.PROGRESS);
        progressEvent.currentTarget = this._loaderInfo;
        progressEvent.percent = this.pixiloader.progress;
        this._loaderInfo.dispatchEvent(progressEvent);        
    }

    protected onComplete = (result:any) =>
    {        
        var ioevent:IOErrorEvent = new IOErrorEvent(IOErrorEvent.IO_ERROR);
        ioevent.currentTarget = this._loaderInfo;
        if(this._loadFailed)
        {            
            ioevent.text = "Could not load " + this._request.url;  
            this._loaderInfo.dispatchEvent(ioevent);      
            return;
        }
        if(this.pixiloader && this.pixiloader.resources)
        {
            var resource = this.pixiloader.resources[this._request.url];
            if(resource)
            {
                var texture:PIXI.Texture = resource.texture;                
                if(texture)
                {
                    var data:BitmapData = BitmapData.setTexture(texture);
                    var bitmap:Bitmap = new Bitmap(data);
                    this._content = bitmap;
                    var completeEvent:Event = new Event(Event.COMPLETE);
                    completeEvent.currentTarget = this._loaderInfo;
                    this._loaderInfo.dispatchEvent(completeEvent);
                    return;
                }   
                else
                {
                    if(this._request.url.indexOf(".json") >= 0)
                    {
                        var textures:PIXI.Texture[] = [];
                        for(var key in resource.textures)
                        {
                            textures.push(resource.textures[key]);
                        }
                        var movie:MovieClip = MovieClip.CreateMovieClip(textures);
                        this._content = movie;
                        var completeEvent:Event = new Event(Event.COMPLETE);
                        completeEvent.currentTarget = this._loaderInfo;
                        this._loaderInfo.dispatchEvent(completeEvent);
                        return;
                    }
                }           
            }
        }        
        ioevent.text = "Could not parse " + this._request.url + ' after loading.'; 
        this._loaderInfo.dispatchEvent(ioevent);
    }

    public get contentLoaderInfo():any
    {
        return this._loaderInfo;
    }

    public get content():DisplayObject
    {
        return this._content;
    }
}