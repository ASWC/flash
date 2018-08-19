import { EventDispatcher } from '../events/EventDispatcher';

export class LoaderInfo extends EventDispatcher
{
    public get url():string
    {
        return window.location.href;
    }

    public get parameters():Object
    {
        return null;
    }
}