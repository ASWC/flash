
export class SoundTransform
{
    protected _leftToLeft:number;
    protected _volume:number;
    protected _rightToRight:number;
    protected _rightToLeft:number;
    protected _pan:number;
    protected _leftToRight:number;

    constructor(value:number = 1, panning:number = 0)
    {
        this._volume = 0;
        this._leftToLeft = 0;
        this._rightToRight = 0;
        this._rightToLeft = 0;
        this._pan = 0;
        this._leftToRight = 0;
        this._volume = value;
    }

    public get leftToLeft():number
    {
        return this._leftToLeft;
    }

    public set leftToLeft(value:number)
    {
        this._leftToLeft = value;
    }

    public get leftToRight():number
    {
        return this._leftToRight;
    }

    public set leftToRight(value:number)
    {
         this._leftToRight = value;   
    }

    public get pan():number
    {
        return this._pan;
    }

    public set pan(value:number)
    {
        this._pan = value;
    }

    public get rightToLeft():number
    {
        return this._rightToLeft;
    }

    public set rightToLeft(value:number)
    {
        this._rightToLeft = value;
    }

    public get rightToRight():number
    {
        return this._rightToRight;
    }

    public set rightToRight(value:number)
    {
        this.rightToRight = value;
    }

    public get volume():number
    {
        if(isNaN(this._volume))
        {
            this._volume = 1;
        }
        return this._volume;
    }

    public set volume(value:number)
    {
        this._volume = value;
    }
}