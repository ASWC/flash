
export class InnerTweenProperty
{
	private target:any;
	private property:string;
	private beginValue:number = 0;
	private difference:number = 0;
	private endValue:number = 0;
	private ease:Function;

	constructor(target:any, property:string, beginValue:number, difference:number, endValue:number, ease:Function)
	{
		this.target = target;
		this.property = property;
		this.beginValue = beginValue;
		this.difference = difference;
		this.endValue = endValue;
		this.ease = ease;
	}

	public finalize():void
	{
		this.target[this.property] = this.endValue;
	}

	public update(time:number, duration:number):void
	{
		this.target[this.property] = this.ease(time, this.beginValue, this.difference, duration);
	}

}
