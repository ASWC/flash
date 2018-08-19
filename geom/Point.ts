
export class Point extends PIXI.Point
{
    constructor(x:number = 0, y:number = 0)
    {
        super(x, y);
    }

    public add(value:Point):void
    {
        this.x += value.x;
        this.y += value.y;
    }

    public clone():Point
    {
        return new Point(this.x, this.y);
    }

    public static distance(startPoint:Point, endPoint:Point):number
    {
        var power:number = Math.sqrt(Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2)) 
        return power;
    }

    public toString():string
    {
        return "x: " + this.x + ", y: " + this.y;
    }
}