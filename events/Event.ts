import { DisplayObject } from "../display/DisplayObject";
import { IEventDispatcher } from "./IEventDispatcher";
import { DisplayObjectContainer } from "../display/DisplayObjectContainer";

export class Event
{
    private static registeredDisplayObjects:DisplayObject[] = [];
    public static ADDED_TO_STAGE:string = "addedToStage";
    public static ENTER_FRAME:string = "enterFrame";
    public static REMOVED_FROM_STAGE:string = "removedFromStage";
    public static SOUND_COMPLETE:string = "soundComplete";
    public static SOUND_STARTED:string = "soundStarted";
    public static COMPLETE:string = "complete";
    public static OPEN:string = "open";
    public static INIT:string = "init";
    public static RENDER:string = "render";
    public static ACTIVATE:string = "activate";
    public static DEACTIVATE:string = "desactivate";
    public static RESIZE:string = "resize";
    public static CHANGE:string = "change";    

    public type:string;
    public bubbles:boolean;
    public cancelable:boolean;
    public currentTarget:IEventDispatcher;
    public which:number;
    public altKey:boolean;
    public ctrlKey:boolean;
    public metaKey:boolean;
    public shiftKey:boolean;
    public _legacyTarget:PIXI.DisplayObject;

    constructor(type:string, bubble:boolean = true, cancelable:boolean = true)
    {
        this.type = type;
        this.bubbles = bubble;
        this.cancelable = cancelable;
    }

    public get target():DisplayObject
    {
        return this.getTarget(this._legacyTarget);
    }

    public stopPropagation()
    {

    }

    public stopImmediatePropagation()
    {

    }

    public preventDefault()
    {

    }

    public static registerDisplayObject(target:DisplayObject):void
    {
        var index:number = Event.registeredDisplayObjects.indexOf(target);
        if(index < 0)
        {
            Event.registeredDisplayObjects.push(target);
        }
    }

    public static unregisterDisplayObject(target:DisplayObject):void
    {
        var index:number = Event.registeredDisplayObjects.indexOf(target);
        if(index >= 0)
        {
            Event.registeredDisplayObjects.splice(index, 1);
        }
    }

    public getTarget(container:PIXI.DisplayObject):DisplayObject
    {
        for(var i:number = 0; i < Event.registeredDisplayObjects.length; i++)
        {
            if(Event.registeredDisplayObjects[i]._innerCompContainer == container)
            {
                return Event.registeredDisplayObjects[i];
            }
        }
        return null;
    }
}