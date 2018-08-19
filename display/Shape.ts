import { DisplayObject } from './DisplayObject';

export class Shape extends DisplayObject
{
    constructor()
    {
        super();        
    }

    public destroy()
    {
        this.graphics.clear();
    }
}