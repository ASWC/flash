
export class Dictionary
{
    private _dicKeys:any[];
    private _dicValues:any[];

    constructor()
    {
        this._dicKeys = [];
        this._dicValues = [];
    }     

    public getValue(key:any):any
    {
        var index:number = this._dicKeys.indexOf(key);
        if(index >= 0)
        {
            return this._dicValues[index];
        }
        return null;
    }

    public setValue(key:any, value:any = null):void
    {
        var index:number = this._dicKeys.indexOf(key);
        if(index >= 0)
        {
            this._dicValues[index] = value;
        }
    }

    public deleteValue(key:any):void
    {
        var index:number = this._dicKeys.indexOf(key);
        if(index >= 0)
        {
            this._dicKeys[index] = null;
            this._dicValues[index] = null;
        }
    }

    public addValue(key:any, value:any = null):void
    {
        var index:number = this._dicKeys.indexOf(key);
        if(index >= 0)
        {
            return;
        }
        this._dicKeys.push(key);
        index = this._dicKeys.indexOf(key);
        this._dicValues[index] = value;
    }
}