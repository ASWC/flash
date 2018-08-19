import { URLRequestHeader } from './URLRequestHeader';
import { URLRequestMethod } from './URLRequestMethod';
import { URLVariables } from './URLVariables';

export class URLRequest
{
    protected _contentType:string;
    protected _url:string;
    protected _method:string;
    protected _envelop:string;
    protected _data:URLVariables;

    constructor(path:string = null)
    {
        this._url = path;
        this._method = URLRequestMethod.POST;        
    }

    public set envelop(value:string)
    {
        this._envelop = value;        
    }

    public get envelop():string
    {
        return this._envelop;
    }

    public get requestHeaders():URLRequestHeader[]
    {
        return null;
    }

    public set requestHeaders(value:URLRequestHeader[])
    {

    }

    public get contentType():string
    {
        return this._contentType;
    }

    public set contentType(value:string)
    {
        this._contentType = value;
    }

    public get url():string
    {
        return this._url;
    }

    public set url(value:string)
    {
        this._url = value;
    }

    public set data(value:URLVariables)
    {        
        this._data = value;
    }

    public get data():URLVariables
    {
        return this._data;
    }

    public get method():string
    {
        return this._method;
    }

    public set method(value:string)
    {
        this._method = value;
    }
}