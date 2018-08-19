import { reveal } from '../trace';
import { TimerEvent } from '../events/TimerEvent';
import { SoundMixer } from './SoundMixer';
import { FakePeak } from './FakePeak';
import { Timer } from '../utils/Timer';
import { SoundTransform } from './SoundTransform';
import { EventDispatcher } from '../events/EventDispatcher';
import { Event } from '../events/Event';

export class SoundChannel extends EventDispatcher
{
    protected static legacyplayingsounds:any = {};
    public static REQUIRES_ANALYSER:boolean = true;
    protected _playing:boolean;
    protected _startTime:number;
    protected _duration:number;
    protected _loops:number;
    protected _transform:SoundTransform;
    protected _rightPeak:number;
    protected _position:number;
    protected _leftPeak:number;
    protected buffer: AudioBuffer;
    protected source: AudioBufferSourceNode;
    protected gainControl: GainNode;
    protected loopCount:number;
    protected analyser:AnalyserNode;
    protected analyserLength:number;
    protected analyserArray:Uint8Array;
    protected analyserTimer:Timer;
    protected legacyAudio:any;
    protected legacyAudioUrl:string;
    protected fakePeak:FakePeak;

    constructor()
    {
        super();
        this._rightPeak = 0;
        this._position = 0;   
        this._duration = 0;     
        this._playing = false;
    }

    public stop()
    {
        this._playing = false;
        if(this.source)
        {
            try
            {
                this.source.stop(0);
            }
            catch(e)
            {
                            
            }
            try
            {
                this.source.disconnect(this.gainControl);
            }
            catch(e)
            {
               
            }           
        }      
        else if(this.legacyAudio)
        {
            this.fakePeak.stop();
            this.legacyAudio.pause()
            this.legacyAudio.removeEventListener('ended', this.handleSoundEnd);
        }
    }

    public get rightPeak():number
    {
        if(this.fakePeak)
        {
            return this.fakePeak.peak;
        }
        return this._rightPeak;
    }

    public get leftPeak():number
    {
        if(this.fakePeak)
        {
            return this.fakePeak.peak;
        }
        return this._leftPeak;
    }    

    public get position():number
    {
        return this._position;
    }

    public set soundTransform(value:SoundTransform)
    {
        this._transform = value;
        if(this.gainControl)
        {
            this.gainControl.gain.value = this._transform.volume;
        }
        else if(this.legacyAudio)
        {
            this.legacyAudio.volume = this._transform.volume;
        }
    }

    public get soundTransform():SoundTransform
    {
        return this._transform;
    }

    public get duration():number
    {
        return this._duration;
    }

    public static startLegacySound(channel:SoundChannel, duration:number, url:string)
    {
        if(SoundChannel.legacyplayingsounds[url])
        {
            return;
        }
        channel._duration = duration;
        if(!channel._transform)
        {
            channel._transform = new SoundTransform(1); 
        }
        SoundChannel.legacyplayingsounds[url] = true;
        channel.legacyAudioUrl = url;
        channel.loopCount = channel._loops; 
        channel.legacyAudio = new Audio(url);
        channel.legacyAudio.addEventListener('ended', channel.handleSoundEnd);
        channel.legacyAudio.addEventListener('loadedmetadata', channel.handleLegacyPlay);
        channel.legacyAudio.addEventListener('error', function(event){reveal(event)});
        channel.legacyAudio.play();
        channel.fakePeak = new FakePeak();
        channel.fakePeak.start();
        channel.legacyAudio.volume = channel._transform.volume;         
        channel._duration = channel.legacyAudio.duration;
    }

    public static setChannelStart(channel:SoundChannel, startTime:number = 0, loops:number = 0, sndTransform:SoundTransform = null):void
    {
        channel._transform = sndTransform;
        channel._loops = loops;
        channel._startTime = startTime;
    }

    public static startChannel(channel:SoundChannel, buffer: AudioBuffer, duration:number)
    {        
        channel._duration = duration;
        if(SoundChannel.REQUIRES_ANALYSER)
        {
            channel.buffer = buffer;
            channel.analyser = SoundMixer.context.createAnalyser();
            channel.analyser.smoothingTimeConstant = 0.3;
            channel.analyser.fftSize = 2048;
            channel.analyserLength = channel.analyser.frequencyBinCount;
            channel.analyserArray = new Uint8Array(channel.analyserLength);
            channel.source = SoundMixer.context.createBufferSource();
            channel.source.buffer = channel.buffer;
            channel.gainControl = SoundMixer.context.createGain();
            channel.source.connect(channel.gainControl);
            channel.gainControl.connect(channel.analyser);
            channel.analyser.connect(SoundMixer.context.destination);
            channel.analyserTimer = new Timer(10);
            channel.analyserTimer.addEventListener(TimerEvent.TIMER, channel.handleAnalyser);
            channel.analyserTimer.start();
        }
        else
        {
            channel.buffer = buffer;
            channel.source = SoundMixer.context.createBufferSource();
            channel.source.buffer = channel.buffer;
            channel.gainControl = SoundMixer.context.createGain();
            channel.source.connect(channel.gainControl);
            channel.gainControl.connect(SoundMixer.context.destination);
        }   
        channel.loopCount = channel._loops;        
        channel.source.loop = false;      
        if(!channel._transform)
        {
            channel._transform = new SoundTransform(1); 
        }            
        channel.gainControl.gain.value = channel._transform.volume;
        channel.source.onended = channel.handleSoundEnd;
        channel.source.start(channel._position);  
        channel._playing = true;    
        if(channel.hasEventListener(Event.SOUND_STARTED))
        {
            var startevent:Event = new Event(Event.SOUND_STARTED);
            startevent.currentTarget = channel;
            channel.dispatchEvent(startevent);
        }
    }

    protected handleLegacyPlay = (event) =>
    {
        //Tracer.show('sound ready to play')
        this.legacyAudio.removeEventListener('loadedmetadata', this.handleLegacyPlay);
        this._duration = this.legacyAudio.duration;
        this._playing = true; 
        if(this.hasEventListener(Event.SOUND_STARTED))
        {
            var startevent:Event = new Event(Event.SOUND_STARTED);
            startevent.currentTarget = this;
            this.dispatchEvent(startevent);
        }
    }

    protected handleSoundEnd = (event) =>
    {        
        if(!this._playing)
        {
            return;
        }
        if(this.loopCount > 0)
        {
            this.loopCount--;
            if(SoundMixer.LEGACYMODE)
            {
                SoundChannel.legacyplayingsounds[this.legacyAudioUrl] = true;
                this.legacyAudio.play();
                this._duration = this.legacyAudio.duration;
                this.fakePeak.start();
            }
            else
            {
                this.source = SoundMixer.context.createBufferSource();
                this.source.buffer = this.buffer;
                this.source.connect(this.gainControl);
                this.gainControl.connect(SoundMixer.context.destination);
                this.gainControl.gain.value = this._transform.volume;
                this.source.onended = this.handleSoundEnd;
                this.source.start(this._position);                   
            }
            var soundevent:Event = new Event(Event.SOUND_COMPLETE);
            this.dispatchEvent(soundevent); 
            return;
        }
        this._playing = false;
        var soundevent:Event = new Event(Event.SOUND_COMPLETE);
        this.dispatchEvent(soundevent);  
        if(SoundMixer.LEGACYMODE)
        {
            delete SoundChannel.legacyplayingsounds[this.legacyAudioUrl];
        }
        if(this.analyserTimer)
        {
            this.analyserTimer.removeEventListener(TimerEvent.TIMER, this.handleAnalyser);
            this.analyserTimer.stop();
        }      
    }

    public get playing():boolean
    {
        return this._playing;
    }

    protected handleAnalyser = (event:TimerEvent) =>
    {
        this.analyser.getByteFrequencyData(this.analyserArray);
        var count:number = 0;        
        for(var i:number = 0; i < this.analyserArray.length; i++)
        {
            count += this.analyserArray[i];
        }
        count = count / this.analyserArray.length;
        this._leftPeak = count / 100;
        this._rightPeak = count / 100;
    }
}