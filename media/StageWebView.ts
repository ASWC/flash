import { Rectangle } from '../geom/Rectangle';
import { BitmapData } from '../display/BitmapData';
import { DisplayObject } from '../display/DisplayObject';

export class StageWebView extends DisplayObject
{
    public static isSupported:boolean;
    
    public get isHistoryBackEnabled():boolean
    {
        return true;
    }

    public set isHistoryBackEnabled(value:boolean)
    {

    }

    public get isHistoryForwardEnabled():boolean
    {
        return true;
    }

    public set isHistoryForwardEnabled(value:boolean)
    {

    }

    public get location():string
    {
        return null;
    }

    public set location(value:string)
    {

    }

    public get title():string
    {
        return null;
    }

    public set title(value:string)
    {

    }

    public dispose():void
    {

    }

    public assignFocus(direction:string):void
    {

    }

    public drawViewPortToBitmapData(data:BitmapData):void
    {

    }

    public historyBack():void
    {

    }

    public historyForward():void
    {

    }

    public loadString(url:string, type:string = null):void
    {

    }

    public reload():void
    {

    }

    public stop():void
    {

    }

    public get viewPort():Rectangle
    {
        return null;
    }

    public set viewPort(value:Rectangle)
    {

    }
}