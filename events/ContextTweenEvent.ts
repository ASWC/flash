import { Event } from './Event';

export class ContextTweenEvent extends Event
{
	public static MOTION_END:string = "motionEnd"
	public static MOTION_UPDATE:string = "motionUpdate"
	public contextTarget:any;
	public percent:number = 0

	constructor(type:string, bubbles:boolean = false, cancelable:boolean = false)
	{
		super(type, bubbles, cancelable);
	}

}
