import { IOErrorEvent } from '../events/IOErrorEvent';
import { SoundTransform } from './SoundTransform';
import { SoundMixer } from './SoundMixer';
import { URLRequest } from '../net/URLRequest';
import { SoundChannel } from './SoundChannel';
import { EventDispatcher } from '../events/EventDispatcher';
import { Event } from '../events/Event';

export class Sound extends EventDispatcher
{
    protected _queuedChannels:SoundChannel[];
    protected _bytesLoaded:number;
    protected _bytesTotal:number;
    protected _isBuffering:boolean;
    protected _length;Number;
    protected _url:string;
    protected _request:URLRequest;
    protected loadrequest:XMLHttpRequest;
    protected buffer: AudioBuffer;
    protected _duration:number;
    protected _loadError:boolean;

    constructor(request:URLRequest = null)
    {
        super();
        this._loadError = false;
        this._queuedChannels = [];
        this._request = request;
    }

    public static connect(sound:Sound, channel:SoundChannel, _starTime:number, _loops:number, _sndTransform:SoundTransform):void
    {
        if(SoundMixer.LEGACYMODE)
        {
            SoundChannel.setChannelStart(channel, _starTime, _loops, _sndTransform);
            SoundChannel.startLegacySound(channel, sound._duration, sound._request.url);           
        }
        else if(!sound.buffer)
        {
            SoundChannel.setChannelStart(channel, _starTime, _loops, _sndTransform);
            sound._queuedChannels.push(channel);
            sound.load(sound._request);
        }
        else
        {
            SoundChannel.setChannelStart(channel, _starTime, _loops, _sndTransform);
            SoundChannel.startChannel(channel, sound.buffer, sound._duration);
        }
    }

    public play(startTime:number = 0, loops:number = 0, sndTransform:SoundTransform = null):SoundChannel
    {
        if(!this._request)
        {
            return null;
        }
        if(SoundMixer.LEGACYMODE)
        {
            var channel:SoundChannel = new SoundChannel();
            SoundChannel.setChannelStart(channel, startTime, loops, sndTransform);
            SoundChannel.startLegacySound(channel, this._duration, this._request.url);
            return channel;
        }
        if(!this.buffer)
        {
            var channel:SoundChannel = new SoundChannel();
            SoundChannel.setChannelStart(channel, startTime, loops, sndTransform);
            this._queuedChannels.push(channel);
            this.load(this._request);
            return channel;
        }
        else
        {
            var channel:SoundChannel = new SoundChannel();
            SoundChannel.setChannelStart(channel, startTime, loops, sndTransform);
            SoundChannel.startChannel(channel, this.buffer, this._duration);
            return channel;
        }
        return null;
    }

    public load(stream:URLRequest):void
    {
        this._request = stream;    
        try
        {    
            this.loadrequest = new XMLHttpRequest();
            this.loadrequest.open('GET', this._request.url, true);
            this.loadrequest.responseType = 'arraybuffer';
            this.loadrequest.addEventListener('load', this.handleSoundLoaded);
            this.loadrequest.addEventListener('error', this.handleSoundLoadedError);
            this.loadrequest.addEventListener('loadend', this.handleSoundLoadedEnd);
            this.loadrequest.send();
        }
        catch(e)
        {
            var errorevent:IOErrorEvent = new IOErrorEvent(IOErrorEvent.IO_ERROR);
            errorevent.text = "Unable to load " + this._request.url;
            this.dispatchEvent(errorevent);
        }
    }

    protected handleSoundLoadedEnd = (event) =>
    {
        if(this._loadError)
        {
            return;
        }
        //Tracer.show("sound loaded end: " + this._request.url)
        if(this.loadrequest.status == 404) 
        {
            var errorevent:IOErrorEvent = new IOErrorEvent(IOErrorEvent.IO_ERROR);
            errorevent.text = "Could not find file " + this._request.url;
            errorevent.errorId = 404;
            this.dispatchEvent(errorevent);
        }
    }

    protected handleSoundLoaded = (event) =>
    {
        if(this._loadError)
        {
            return;
        }
        //Tracer.show("sound loaded: " + this._request.url)
        if(!this.loadrequest.response)
        {
            return;
        }
        var arrayBuffer:ArrayBuffer = this.loadrequest.response;
        if(!arrayBuffer || !arrayBuffer.byteLength)
        {
            this.handleDataDecodeError(null);
            return;
        }        
        try
        {
            //Tracer.show("attempt to decode data for " + this._request.url)
            var promise = SoundMixer.context.decodeAudioData(arrayBuffer, this.handleDataDecoded, this.handleDataDecodeError);
            if(promise)
            {
                //Tracer.reveal(promise)
            }
        }
        catch(e)
        {
            
        }               
    }

    public get duration():number
    {
        return this._duration;
    }

    protected handleDataDecoded = (buffer: AudioBuffer) =>
    {
        if(this._loadError)
        {
            return;
        }
        //Tracer.show("sound decoded: " + this._request.url)
        this.buffer = buffer;
        this._duration = this.buffer.duration;
        if(this.hasEventListener(Event.COMPLETE))
        {
            var event:Event = new Event(Event.COMPLETE);        
            this.dispatchEvent(event);
        }
        if(this._queuedChannels.length)
        {
            while(this._queuedChannels.length)
            {
                var channel:SoundChannel = this._queuedChannels.shift();
                SoundChannel.startChannel(channel, this.buffer, this._duration);
            }           
        }
    }

    protected handleDataDecodeError = (event) =>
    {            
        //this._loadError = true;
        //Tracer.show("sound decode error: " + this._request.url)
        var errorevent:IOErrorEvent = new IOErrorEvent(IOErrorEvent.IO_ERROR);
        errorevent.text = "Unable to decode data for " + this._request.url;
        errorevent.errorId = 304;
        this.dispatchEvent(errorevent);
    }

    protected handleSoundLoadedError = (event) =>
    {
        this._loadError = true;
        //Tracer.show("sound load error: " + this._request.url)
        var errorevent:IOErrorEvent = new IOErrorEvent(IOErrorEvent.IO_ERROR);
        errorevent.text = "Unable to load " + this._request.url;
        errorevent.errorId = 404;
        this.dispatchEvent(errorevent);
    }    

    public close():void
    {

    }

    public get url():string
    {
        return this._url;
    }

    public get length():number
    {
        return this._length;
    }

    public get isBuffering():boolean
    {
        return this._isBuffering;
    }

    public get bytesTotal():number
    {
        return this._bytesTotal;
    }

    public get bytesLoaded():number
    {
        return this._bytesLoaded;
    }
}