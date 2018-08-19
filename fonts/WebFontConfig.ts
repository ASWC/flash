import { Tracer } from "../../superduperinc/flash/log/Tracer";


export class WebFontConfig implements WebFont.Config
{
    public google:GoogleFont;
    public custom:CustomFont;
    public typekit:TypeKitFont;
    public fontdeck:FontDeckFont;
    public monotype:MonotypeFont;
    /** Setting this to false will disable html classes (defaults to true) */
    public classes:boolean;
    /** Settings this to false will disable callbacks/events (defaults to true) */
    public events:boolean;
    /** Time (in ms) until the fontinactive callback will be triggered (defaults to 5000) */
    public timeout:number;
    /** Child window or iframes to manage fonts for */
    public context:string[];
    /** This event is triggered when all fonts have been requested. */
    public loading():void
    {
        //Tracer.show('font loading')
    }
    /** This event is triggered when the fonts have rendered. */
    public active():void
    {
        //Tracer.show('font active')
    }
    /** This event is triggered when the browser does not support linked fonts or if none of the fonts could be loaded. */
    public inactive():void
    {
        //Tracer.show('font inactive')
    }
    /** This event is triggered once for each font that's loaded. */
    public fontloading(familyName:string, fvd:string):void
    {
        //Tracer.show('font fontloading')
    }
    /** This event is triggered once for each font that renders. */
    public fontactive(familyName:string, fvd:string):void
    {
        //Tracer.show('font fontactive')
    }
    /** This event is triggered if the font can't be loaded. */
    public fontinactive(familyName:string, fvd:string):void
    {
        //Tracer.show('font fontinactive')
    }

    

    /*public custom:WebFont.Custom;
    public google:WebFont.Google;
    public typekit:WebFont.Typekit;
    public fontdeck:WebFont.Fontdeck;
    public monotype:WebFont.Monotype;*/
}

export class CustomFont implements WebFont.Custom
{
    public families:string[];
	public urls:string[];
    public testStrings:{[fontFamily:string]:string};
    
    constructor(families:string[], urls:string[])
    {
        this.families = families;
        this.urls = urls;
    }
}

export class GoogleFont implements WebFont.Google
{
    public families: string[];    
    public text: string;    

    constructor(families: string[], text: string = null)
    {
        this.families = families;
        this.text = text;
    }
}

export class TypeKitFont implements WebFont.Typekit
{
    public id:string;

    constructor(id:string)
    {
        this.id = id;
    }
}

export class FontDeckFont implements WebFont.Fontdeck
{
    public id?:string;

    constructor(id:string)
    {
        this.id = id;
    }
}

export class MonotypeFont implements WebFont.Monotype
{
    public projectId:string;
    public version:number;
    
    constructor(projectId:string, version:number)
    {
        this.projectId = projectId;
        this.version = version;
    }
}