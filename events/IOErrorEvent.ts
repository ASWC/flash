import { Event } from './Event';

export class IOErrorEvent extends Event
{
    public static IO_ERROR:string = "ioError";

    


    public text:string;
    public errorId:number = 0;
}