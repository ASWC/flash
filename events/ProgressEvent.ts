import { Event } from './Event';

export class ProgressEvent extends Event
{
    public static PROGRESS:string = "progress";
    


    public bytesLoaded:number;
    public bytesTotal:number;
    public percent:number;
}