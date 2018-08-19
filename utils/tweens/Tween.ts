import { ContextTweenEvent } from '../../events/ContextTweenEvent';
import { Linear } from './easing/Linear';
import { InnerTweenProperty } from './InnerTweenProperty';
import { EventDispatcher } from '../../events/EventDispatcher';
import { Timer } from '../Timer';

export class Tween extends EventDispatcher
{
	private static tweens:Tween[] = [];
	private static activeTweens:Tween[] = [];

	public target:any;
	private func:Function;
	private _duration:number = 0;
	private _time:number = 0;
	private _startTime:number = 0;
	private prevTime:number = 0;
	private properties:InnerTweenProperty[];
	private needEndDispatch:boolean;
    private needChangeDispatch:boolean;
    
    constructor(target:any, duration:number, props:Object, easing:Function = null)
	{
		super();
		Tween.tweens.push(this);
		if(!target)
		{
			return;
		}
		this.target = target;
		if (easing instanceof Function)
		{
			this.func = easing;
		}
		else
		{
			this.func = Linear.easeNone;
		}
		this.properties = []
		for (var value in props)
		{
			var property:InnerTweenProperty = new InnerTweenProperty(target, value, target[value], props[value] - target[value], props[value], this.func);
			this.properties.push(property);
		}
		this._duration = (duration <= 0) ? Infinity : duration;
		this._time = 0;
		this._startTime = Timer.getTimer();	
		Tween.registerTween(this);
	}

	public run():void
	{
		var currentTime:number = (Timer.getTimer() - this._startTime) / 1000;
		this.prevTime = this._time;
		if (currentTime > this._duration)
		{
			Tween.unregisterTween(this);
			for (var i:number = 0; i < this.properties.length; i++)
			{
				this.properties[i].finalize();
			}
			if(this.hasEventListener(ContextTweenEvent.MOTION_END))
			{
				var endEvent:ContextTweenEvent = new ContextTweenEvent(ContextTweenEvent.MOTION_END);
				endEvent.contextTarget = this.target;
				this.dispatchEvent(endEvent);
			}
			if(this.hasEventListener(ContextTweenEvent.MOTION_UPDATE))
			{
				var change:number = (currentTime / this._duration) * 100;
				if(change > 100)
				{
					change = 100;
				}
				var changeEvent:ContextTweenEvent = new ContextTweenEvent(ContextTweenEvent.MOTION_UPDATE);
				changeEvent.contextTarget = this.target;
				changeEvent.percent = change;
				this.dispatchEvent(changeEvent);
			}
			this.properties = null;
			this.func = null;
			this.target = null;
			Tween.removeTween(this);
		}
		else
		{
			this._time = currentTime;
			for (i = 0; i < this.properties.length; i++)
			{
				this.properties[i].update(this._time, this._duration);
			}
			if(this.hasEventListener(ContextTweenEvent.MOTION_UPDATE))
			{
				change = (currentTime / this._duration) * 100;
				if(change > 100)
				{
					change = 100;
				}
				changeEvent = new ContextTweenEvent(ContextTweenEvent.MOTION_UPDATE);
				changeEvent.contextTarget = this.target;
				changeEvent.percent = change;
				this.dispatchEvent(changeEvent);
			}
		}
	}

	public static stop(obj:any = null):void
	{
		for(var i:number = 0; i < Tween.tweens.length; i++)
		{
			var currentTween:Tween = Tween.tweens[i];
			if(obj)
			{
				if(currentTween.target == obj)
				{
					Tween.removeTween(currentTween);
				}
			}
			else
			{
				//ContextTween.removeTween(currentTween);
			}
		}
	}

	public static to(obj:any, duration:number, props:Object, easing:Function = null, stopPrevious:boolean = true):Tween
	{
		if(stopPrevious)
		{
			for(var i:number = 0; i < Tween.tweens.length; i++)
			{
				var currentTween:Tween = Tween.tweens[i];
				if(currentTween.target == obj)
				{
					Tween.removeTween(currentTween);
				}
			}
		}
		return new Tween(obj, duration, props, easing);
	}

	private static removeTween(tween:Tween)
	{
		for(var i:number = 0; i < Tween.tweens.length; i++)
		{
			var currentTween:Tween = Tween.tweens[i];
			if(currentTween == tween)
			{
				Tween.unregisterTween(tween);
				tween.target = null;
				tween.removeListeners();
				Tween.tweens.splice(i, 1);
			}
		}
	}

	private static registerTween(tween:Tween):void
    {
        var index:number = Tween.activeTweens.indexOf(tween);
        if(index < 0)
        {
            Tween.activeTweens.push(tween);
        }
    }

    private static unregisterTween(tween:Tween):void
    {
        var index:number = Tween.activeTweens.indexOf(tween);
        if(index >= 0)
        {
            Tween.activeTweens.splice(index, 1);
        }
    }

	public static runTweens():void
    {
        for(var i:number = 0; i < Tween.activeTweens.length; i++)
        {
            Tween.activeTweens[i].run();
        }
    }
}

interface ContextTweenReference
{
	[name:string] : Tween;
}