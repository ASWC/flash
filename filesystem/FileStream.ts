import { EventDispatcher } from './../events/EventDispatcher';
import { File } from './File';

export class FileStream extends EventDispatcher
{
    public openAsync(file:File, fileMode:string):void
    {

    }

    public writeUTFBytes(value:string):void
    {

    }

    public get bytesAvailable():number
    {
        return 0;
    }

    public readUTFBytes(length:number):string
    {
        return null;
    }

    public open(file:File, mode:string):void
    {

    }

    public writeBytes(data:any):void
    {

    }

    public close():void
    {
        
    }
}