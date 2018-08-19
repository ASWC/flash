import { Event } from './Event';

export class HTTPStatusEvent extends Event
{
    public static HTTP_RESPONSE_STATUS:string = "httpResponseStatus";
    public static HTTP_STATUS:string = "httpStatus";

    public redirected:boolean;
    public responseHeaders:any[];
    public responseURL:string;
    public status:number;

    constructor(type:string, bubble:boolean = true, cancelable:boolean = true)
    {
        super(type, bubble, cancelable)
        this.redirected = false;
        this.responseHeaders = [];
        this.responseURL = '';
        this.status = 0;
    }
    
}