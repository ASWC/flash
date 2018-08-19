import { IOErrorEvent } from './../events/IOErrorEvent';
import { URLRequest } from './URLRequest';
import { EventDispatcher } from './../events/EventDispatcher';
import { Event } from '../events/Event';

export class URLLoader extends EventDispatcher
{
    protected xmlhttp:XMLHttpRequest;
    protected request:URLRequest;
    protected _data:string;

    constructor()
    {
        super();
        this.xmlhttp = new XMLHttpRequest();
    }

    public get data():string
    {
        return this._data;
    }

    public set data(value:string)
    {
       
    }

    public close():void
    {
        
    }

    public load(value:URLRequest):void
    {        
        this.request = value;
        var path:string = this.request.url;
        if(!path)
        {
            return;
        }
        if(this.request.data)
        {
            var params:string = '';
            for(var key in this.request.data)
            {
                params += key + "=" + this.request.data[key] + "&";                
            }
            params = params.substr(0, params.length - 1);
            path += "?" + params;
        }
        this.xmlhttp.open(this.request.method, path, true);
        this.xmlhttp.onreadystatechange = this.onHttpResponse;
        if(path.indexOf(".json") < 0)
        {
            if(this.request.contentType != 'json')
            {
                this.xmlhttp.setRequestHeader('Content-Type', 'text/xml');
            }            
        }        
        if(this.request.envelop)
        {
            this.xmlhttp.send(this.request.envelop)
        }
        else
        {
            this.xmlhttp.send();           
        }
    }

    private onHttpResponse = ()=>
    {
        if (this.xmlhttp.readyState == 4 && this.xmlhttp.status == 200) 
        {
            this._data = this.xmlhttp.responseText;
            this.dispatchEvent(new Event(Event.COMPLETE));
        }     
        else if(this.xmlhttp.readyState == 4 && this.xmlhttp.status == 404)
        {
            var errorevent:IOErrorEvent = new IOErrorEvent(IOErrorEvent.IO_ERROR);
            errorevent.text = "Could not find file " + this.request.url;
            errorevent.errorId = 404;
            this.dispatchEvent(errorevent);
        }
        else if(this.xmlhttp.readyState == 4 && this.xmlhttp.status == 403)
        {
            var errorevent:IOErrorEvent = new IOErrorEvent(IOErrorEvent.IO_ERROR);
            errorevent.text = "Cross Origin Error " + this.request.url;
            errorevent.errorId = 403;
            this.dispatchEvent(errorevent);
        }
        else if(this.xmlhttp.readyState == 4 && this.xmlhttp.status != 200)
        {
            var errorevent:IOErrorEvent = new IOErrorEvent(IOErrorEvent.IO_ERROR);
            errorevent.text = "Unkown Error " + this.request.url;
            errorevent.errorId = this.xmlhttp.status;
            this.dispatchEvent(errorevent);
        }
    }

    public get dataFormat():string
    {
        return null;
    }

    public set dataFormat(value:string)
    {

    }
}