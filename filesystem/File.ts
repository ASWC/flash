
export class File
{
    constructor(path:string)
    {

    }

    public static get applicationStorageDirectory():File
    {
        return null
    }

    public static get applicationDirectory():File
    {
        return null
    }

    public get exists():boolean
    {
        return true;
    }

    
    public get nativePath():string
    {
        return null;
    }

    public get url():string
    {
        return null;
    }
    

    public resolvePath(path:string):File
    {
        return null;
    }
}