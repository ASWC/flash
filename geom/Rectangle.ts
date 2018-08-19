import { Point } from './Point';

export class Rectangle extends PIXI.Rectangle
{
    constructor(x:number = 0, y:number = 0, width:number = 0, height:number = 0)
    {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    public intersection(toIntersect:Rectangle):Rectangle
    {
        var rect:Rectangle = new Rectangle();
        if(this.intersects(toIntersect))
        {            
            rect.x = Math.max(this.x, toIntersect.x);
            rect.y = Math.max(this.y, toIntersect.y);
            rect.width = Math.min(this.x + this.width, toIntersect.x + toIntersect.width) - rect.x;
            rect.height = Math.min(this.y + this.height, toIntersect.y + toIntersect.height) - rect.y;            
        }        
        return rect;
    }

    public intersects(toIntersect:Rectangle):boolean
    {
        if(this.containsCoordinates(toIntersect.x, toIntersect.y))
        {
            return true;
        }
        if(this.containsCoordinates(toIntersect.x + toIntersect.width, toIntersect.y))
        {
            return true;
        }
        if(this.containsCoordinates(toIntersect.x, toIntersect.y + toIntersect.height))
        {
            return true;
        }
        if(this.containsCoordinates(toIntersect.x + toIntersect.width, toIntersect.y + toIntersect.height))
        {
            return true;
        }
        if(toIntersect.containsCoordinates(this.x, this.y))
        {
            return true;
        }
        if(toIntersect.containsCoordinates(this.x + this.width, this.y))
        {
            return true;
        }
        if(toIntersect.containsCoordinates(this.x, this.y + this.height))
        {
            return true;
        }
        if(toIntersect.containsCoordinates(this.x + this.width, this.y + this.height))
        {
            return true;
        }
        return false;
    }

    public containsPoint(point:Point):Boolean
    {
        return this.containsCoordinates(point.x, point.y);
    }

    private containsCoordinates(posX:number, posY:number):boolean
    {
        //Tracer.show(this.toString() + " match to: " + posX + " : " + posY);
        if(posX >= this.x && posX <= this.x + this.width)
        {
            if(posY >= this.y && posY <= this.y + this.height)
            {
                return true;
            }
        }
        return false;
    }

    public union(toUnion:Rectangle):Rectangle
    {        
        var rect:Rectangle = new Rectangle();
        rect.x = Math.min(this.x, toUnion.x);
        rect.y = Math.min(this.y, toUnion.y);
        rect.width = Math.max(this.x + this.width, toUnion.x + toUnion.width) - rect.x;
        rect.height = Math.max(this.y + this.height, toUnion.y + toUnion.height) - rect.y;
        return rect;
    }

    public get size():Point
    {
        return new Point(this.width, this.height);
    }

    public toString():string
    {
        return "x: " + this.x + " y: " + this.y +  " width: " + this.width + " height: " + this.height;
    }
}