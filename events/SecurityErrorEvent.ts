import { Event } from './Event';

export class SecurityErrorEvent extends Event
{
    public static SECURITY_ERROR:string = "securityError";
    
    public text:string;
}