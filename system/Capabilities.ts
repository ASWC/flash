
export class Capabilities
{
    public static screenResolutionX:number;
    public static screenResolutionY:number;
    public static screenDPI:number = 160;
    private static isInit:boolean;
    private static any:boolean;
    private static phone:boolean;
    private static tablet:boolean;
    private static apple:Object;
    private static amazon:Object;
    private static android:Object;
    private static windows:Object;
    private static other:Object;
    private static seven_inch:Object;
    private static _debugMobile:boolean = false;

    private static init():void
    {
        Capabilities.isInit = true;
        var b = new RegExp("iPhone","i");
        var c = new RegExp("iPod","i");
        var d = new RegExp("iPad","i");
        var e = new RegExp("(?=.*\bAndroid\b)(?=.*\bMobile\b)","i");
        var f = new RegExp("Android","i");
        var g = new RegExp("(?=.*\bAndroid\b)(?=.*\bSD4930UR\b)","i");
        var h = new RegExp("(?=.*\bAndroid\b)(?=.*\b(?:KFOT|KFTT|KFJWI|KFJWA|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|KFARWI|KFASWI|KFSAWI|KFSAWA)\b)","i");
        var i = new RegExp("IEMobile","i");
        var j = new RegExp("(?=.*\bWindows\b)(?=.*\bARM\b)","i");
        var k = new RegExp("BlackBerry","i");
        var l = new RegExp("BB10","i");
        var m = new RegExp("Opera Mini","i");
        var n = new RegExp("(CriOS|Chrome)(?=.*\bMobile\b)", "i");
        var o = new RegExp("(?=.*\bFirefox\b)(?=.*\bMobile\b)", "i");
        var p = new RegExp("(?:Nexus 7|BNTV250|Kindle Fire|Silk|GT-P1000)","i");
        var q = function(a,b){return a.test(b)};
        var agent:string = window.navigator.userAgent;        
        Capabilities.apple = {phone:q(b,agent),ipod:q(c,agent),tablet:!q(b,agent)&&q(d,agent),device:q(b,agent)||q(c,agent)||q(d,agent)};
        Capabilities.amazon = {phone:q(g,agent),tablet:!q(g,agent)&&q(h,agent),device:q(g,agent)||q(h,agent)};
        Capabilities.android = {phone:q(g,agent)||q(e,agent),tablet:!q(g,agent)&&!q(e,agent)&&(q(h,agent)||q(f,agent)),device:q(g,agent)||q(h,agent)||q(e,agent)||q(f,agent)};
        Capabilities.windows = {phone:q(i,agent),tablet:q(j,agent),device:q(i,agent)||q(j,agent)};
        Capabilities.other = {blackberry:q(k,agent),blackberry10:q(l,agent),opera:q(m,agent),firefox:q(o,agent),chrome:q(n,agent),device:q(k,agent)||q(l,agent)||q(m,agent)||q(o,agent)||q(n,agent)};
        Capabilities.seven_inch = q(p,agent);
        Capabilities.any = Capabilities.apple['device'] || Capabilities.android['device'] || Capabilities.windows['device'] || Capabilities.other['device'] || Capabilities.seven_inch;
        Capabilities.phone = Capabilities.apple['phone'] || Capabilities.android['phone'] || Capabilities.windows['phone'];
        Capabilities.tablet = Capabilities.apple['tablet'] || Capabilities.android['tablet'] || Capabilities.windows['tablet']; 
    }

    public static get device():string
    {
        if(Capabilities.amazon)
        {
            if(Capabilities.phone)
            {
                return "Amaon Phone"
            }
            if(Capabilities.tablet)
            {
                return "Amazon tablet"
            }
            if(Capabilities.any)
            {
                return "Amazon Computer"
            }
        }
        if(Capabilities.android)
        {
            if(Capabilities.phone)
            {
                return "Android Phone"
            }
            if(Capabilities.tablet)
            {
                return "Android tablet"
            }
            if(Capabilities.any)
            {
                return "Android Computer"
            }
        }
        if(Capabilities.windows)
        {
            if(Capabilities.phone)
            {
                return "Windows Phone"
            }
            if(Capabilities.tablet)
            {
                return "Windows tablet"
            }
            if(Capabilities.any)
            {
                return "Windows Computer"
            }
        }
        if(Capabilities.other)
        {
            if(Capabilities.phone)
            {
                return "Other Phone"
            }
            if(Capabilities.tablet)
            {
                return "Other tablet"
            }
            if(Capabilities.any)
            {
                return "Other Computer"
            }
        }
        if(Capabilities.apple)
        {
            if(Capabilities.phone)
            {
                return "Apple Phone"
            }
            if(Capabilities.tablet)
            {
                return "Apple tablet"
            }
            if(Capabilities.any)
            {
                return "Apple Computer"
            }
        }
        return "unknown"
    }

    public static get agent():string
    {
        return navigator.userAgent
    }

    public static set debugMobile(value:boolean)
    {
        Capabilities._debugMobile = value;
    }

    public static get isOnMobile():boolean
    {
        if(Capabilities._debugMobile)
        {
            return Capabilities._debugMobile;
        }
        if(!Capabilities.isInit)
        {
            Capabilities.init(); 
        }     
        return Capabilities.any;
    } 
}