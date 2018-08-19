import { Stage } from './../display/Stage';

export class Mouse
{
    public static hide():void
    {
        Stage.hideCursor();    
    }

    public static show():void
    {
        Stage.showCursor();
    }
}