import { Event } from './Event';

export class FullScreenEvent extends Event
{
    public static FULL_SCREEN:string = "fullScreen";

    constructor(type:string, bubble:boolean = false, cancelable:boolean = false)
    {
        super(type, bubble, cancelable);
    }
}