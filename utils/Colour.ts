
export class Colour
{
	private _color:number = 0;
	private _red:number = 0;
	private _green:number = 0;
	private _blue:number = 0;
	private _alpha:number = 0;
	private delegates:Object;
	private needUpdate:boolean;

	constructor(color:number = 0xFFFFFFFF)
	{
		this._color = color;
	}

	public get toWebRGB():string
	{
		var result:string = this.toStringRed + this.toStringGreen + this.toStringBlue;
		return '#' + result;
	}

	public get toWebARGB():string
	{
		var result:string = this.toStringAlpha + this.toStringRed + this.toStringGreen + this.toStringBlue;
		return '#' + result;
	}

	public get toStringRGB():string
	{
		var result:string = this.toStringRed + this.toStringGreen + this.toStringBlue;
		return '0x' + result;
	}

	public get toStringARGB():string
	{
		var result:string = this.toStringAlpha + this.toStringRed + this.toStringGreen + this.toStringBlue;
		return '0x' + result;
	}

	public get toStringAlpha():string
	{
		var result:string = ((this._color >> 24)&0xFF).toString(16).toUpperCase();
		if(result.length == 1)
		{
			result = "0" + result;
		}
		return result;
	}

	public get toStringRed():string
	{
		var result:string = ((this._color >> 16)&0xFF).toString(16).toUpperCase();
		if(result.length == 1)
		{
			result = "0" + result;
		}
		return result;
	}

	public get toStringGreen():string
	{
		var result:string = ((this._color >> 8)&0xFF).toString(16).toUpperCase();
		if(result.length == 1)
		{
			result = "0" + result;
		}
		return result;
	}

	public get toStringBlue():string
	{
		var result:string = (this._color&0xFF).toString(16).toUpperCase();
		if(result.length == 1)
		{
			result = "0" + result;
		}
		return result;
	}

    public get plainColor():number
	{
        var value:number = 0x000000;
		value |= (this.red<<16);
        value |= (this.green<<8);
        value |= (this.blue);
		return value;
	}

    public get color():number
	{
		return this._color;
	}

	public set color(value:number)
	{
		this._color = value;
	}

	public get alpha():number
	{
		return (this._color >> 24) & 0xFF;
	}

	public get red():number
	{
		return (this._color >> 16) & 0xFF;
	}

	public get green():number
	{
		return (this._color >> 8) & 0xFF;
	}

	public get blue():number
	{
		return this._color & 0xFF;
	}

    public get absoluteAlpha():number
	{
		return ((this._color >> 24) & 0xFF) / 255;
	}

	public get absoluteRed():number
	{
		return ((this._color >> 16) & 0xFF) / 255;
	}

	public get absoluteGreen():number
	{
		return ((this._color >> 8) & 0xFF) / 255;
	}

	public get absoluteBlue():number
	{
		return (this._color & 0xFF) / 255;
	}

	public set alpha(value:number)
	{
		if (value < 0)
		{
			value = 0;
		}
		else if (value > 255)
		{
			value = 255;
		}
		this._color &= (0x00FFFFFF);
		this._color |= (value<<24);
	}

	public set absoluteAlpha(value:number)
	{
		if (value < 0)
		{
			value = 0;
		}
		else if (value > 1)
		{
			value = 1;
		}
		value = value * 255;
		this._color &= (0x00FFFFFF);
		this._color |= (value<<24);
	}

	public set red(value:number)
	{
		if (value < 0)
		{
			value = 0;
		}
		else if (value > 255)
		{
			value = 255;
		}
		this._color &= (0xFF00FFFF);
		this._color |= (value<<16);
	}

	public set absoluteRed(value:number)
	{
		if (value < 0)
		{
			value = 0;
		}
		else if (value > 1)
		{
			value = 1;
		}
		value = value * 255;
		this._color &= (0xFF00FFFF);
		this._color |= (value<<16);
	}

	public set green(value:number)
	{
		if (value < 0)
		{
			value = 0;
		}
		else if (value > 255)
		{
			value = 255;
		}
		this._color &= (0xFFFF00FF);
		this._color |= (value<<8);
	}

	public set absoluteGreen(value:number)
	{
		if (value < 0)
		{
			value = 0;
		}
		else if (value > 1)
		{
			value = 1;
		}
		value = value * 255;
		this._color &= (0xFFFF00FF);
		this._color |= (value<<8);
	}

	public set blue(value:number)
	{
		if (value < 0)
		{
			value = 0;
		}
		else if (value > 255)
		{
			value = 255;
		}
		this._color &= (0xFFFFFF00);
		this._color |= (value);
	}

	public set absoluteBlue(value:number)
	{
		if (value < 0)
		{
			value = 0;
		}
		else if (value > 1)
		{
			value = 1;
		}
		value = value * 255;
		this._color &= (0xFFFFFF00);
		this._color |= (value);
	}

	public static limit(n:number,hi:number,lo:number):number 
		{
			if (n < lo) 
			{
				return lo;
			}
			else if (n > hi) 
			{
				return hi;
			}
			return n;
		}

	public static darken(n:number, amount:number = -64):number 
	{
		var r:number,g:number,b:number,tot:number;
		r=n>>16 & 0xff;g=n>>8 & 0xff;b=n & 0xff;
		return (Colour.limit(r+amount,0xff,0)<<16)+(Colour.limit(g+amount,0xff,0)<<8)+(Colour.limit(b+amount,0xff,0));
	}

}
