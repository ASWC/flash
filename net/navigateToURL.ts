import { URLRequest } from './URLRequest';

export class navigateToURL
{
    constructor(request:URLRequest)
    {

    }

    public static go(request:URLRequest, _type:String = null)
    {
        window.location.href = request.url;
    }
}