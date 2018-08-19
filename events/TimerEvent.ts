import { Event } from './Event';

export class TimerEvent extends Event
{
    public static TIMER:string = "timer";
    public static TIMER_COMPLETE:string = "timerComplete";
    public static STABLE_RATE:string = "stablerate";

    public rate:number;

    public updateAfterEvent():void
    {
        
    }
}