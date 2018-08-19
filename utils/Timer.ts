import { TimerEvent } from '../events/TimerEvent';
import { IRateDelegate } from './IRateDelegate';
import { EventDispatcher } from '../events/EventDispatcher';

export class Timer extends EventDispatcher
{
    public static rateDelegate:IRateDelegate;
    private static newTime:number = 0;
    private static currentTime:number = 0;
    private static currentRate:number = 0;
    private static average:number = 0;
    private static stableRateMaxLength:number = 20;
    private static rateCheck:number = 20;    
    private static stableRate:number[];
    private static timertrackStarted:boolean;
    private static timerStartTime:number;
    private static activeTimers:Timer[] = [];
    private _currentCount:number;
    private _delay:number;
    private _repeatCount:number;
    private _running:boolean;
    private infinite:boolean;
    private timerStartTime:number;
    private timerEvent:TimerEvent;
    private completeEvent:TimerEvent;
    public name:string;

    constructor(delay:number, repeatCount:number = 0)
    {
        super();
        this.name = null;
        this.delay = delay;
        this.repeatCount = repeatCount;
        this._currentCount = 0;
        this.timerEvent = new TimerEvent(TimerEvent.TIMER);
        this.timerEvent.currentTarget = this;
        this.completeEvent = new TimerEvent(TimerEvent.TIMER_COMPLETE);
        this.completeEvent.currentTarget = this;
    }

    private run():void
    {        
        var timeLimit:number = parseInt(this.timerStartTime.toString()) + parseInt(this._delay.toString())        
        if(timeLimit < Timer.getTimer())
        {             
            this.timerStartTime = Timer.getTimer();
            this._currentCount += 1;  
            if(this.repeatCount > 0)
            {
                if(this._currentCount == this.repeatCount)
                {
                    this.dispatchEvent(this.completeEvent);
                    this.stop();                   
                    return;
                }
            }    
            this.dispatchEvent(this.timerEvent);
        }
    }

    public stop():void
    {
        this._running = false;
        Timer.unregisterTimer(this);
    }

    public start():void
    {
        if(this._running == true)
        {
            return;
        }
        this._running = true;
        this.timerStartTime = Timer.getTimer();
        Timer.registerTimer(this);  
    }

    public reset():void
    {
        this.stop();
        this._running = false;
        this.timerStartTime = Timer.getTimer();
        this._currentCount = 0; 
        this.delay = this._delay;
        this.repeatCount = this._repeatCount;
    }

    public set repeatCount(value:number)
    {
        this._repeatCount = value;
        if(this._repeatCount <= 0)
        {
            this.infinite = true;
        }
        else
        {
            this.infinite = false;
        }
    }

    public set delay(value:number)
    {
        this._delay = value;
    }

    public get repeatCount():number
    {
        return this._repeatCount;
    }

    public get delay():number
    {
        return this._delay;
    }

    public get currentCount():number
    {
        return this._currentCount;
    }

    public get running():boolean
    {
        return this._running;
    }

    public static checkFramerate():void
    {
        var interval:number = Timer.getTimer();
		Timer.newTime = interval- Timer.currentTime;
		Timer.currentTime = interval;
		Timer.currentRate = 1000 / Timer.newTime;
        Timer.average = Timer.currentRate;
        if(Timer.stableRate)
		{
			Timer.stableRate.unshift(Timer.currentRate);
			if(Timer.stableRate.length > Timer.stableRateMaxLength)
			{
				Timer.stableRate.length = Timer.stableRateMaxLength;
				var rateCheck:number = 0;
				for(var i:number = 0; i < Timer.stableRate.length; i++)
				{
					rateCheck += Timer.stableRate[i];
				}
                rateCheck = rateCheck / Timer.stableRate.length;		
                Timer.rateCheck = rateCheck;
                if(Timer.rateDelegate)
                {
                    Timer.rateDelegate.onStableRate(Timer.rateCheck);
                }
			}			
        }
        else
        {
            this.stableRate = [];
        }
    }

    public static get framerate():number
    {
        return Timer.rateCheck;
    }

    public static runTimers():void
    {
        Timer.checkFramerate();
        for(var i:number = 0; i < Timer.activeTimers.length; i++)
        {
            Timer.activeTimers[i].run();
        }
    }

    public static getTimer():number
    {
        if(!Timer.timertrackStarted)
        {
            Timer.timertrackStarted = true;
            Timer.timerStartTime = Timer.getCurrentTime();
        }
        return Math.floor(Timer.getCurrentTime() - Timer.timerStartTime);
    }

    private static getCurrentTime():number
    {
        if(window['performance'] && window['performance']['now'])
        {
            return performance.now();
        }        
        return Date.now();
    }

    private static registerTimer(timer:Timer):void
    {
        var index:number = Timer.activeTimers.indexOf(timer);
        if(index < 0)
        {
            Timer.activeTimers.push(timer);
        }
    }

    private static unregisterTimer(timer:Timer):void
    {
        var index:number = Timer.activeTimers.indexOf(timer);
        if(index >= 0)
        {
            Timer.activeTimers.splice(index, 1);
        }
    }
}