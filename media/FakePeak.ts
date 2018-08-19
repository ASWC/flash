import { ContextTweenEvent } from './../events/ContextTweenEvent';
import { Tween } from './../utils/tweens/Tween';

export class FakePeak
{
    protected _peak:number;

    constructor()
    {
        this._peak = 0;
    }

    public stop():void
    {
        Tween.stop(this);
        this._peak = 0;
    }

    public start():void
    {
        this.stop();
        this.endMotion(null);
    }

    protected endMotion = (event)=>
    {
        var extra:number = Math.random() * 0.2;
        if(this._peak == 0)
        {
            Tween.to(this, 0.1 + extra, {peak:1}).addEventListener(ContextTweenEvent.MOTION_END, this.endMotion);
        }
        else
        {
            Tween.to(this, 0.1 + extra, {peak:0}).addEventListener(ContextTweenEvent.MOTION_END, this.endMotion);
        }
    }

    public set peak(value:number)
    {
        this._peak = value;
    }

    public get peak():number
    {
        return this._peak;
    }
}