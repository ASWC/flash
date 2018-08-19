import { Event } from './Event';

export class MouseEvent extends Event
{    
    public static CLICK:string = "pointertap";
    public static MOUSE_CLICK:string = "pointertap";
    public static MOUSE_UP_OUTSIDE:string = "pointerupoutside";
    public static MOUSE_UP:string = "pointerup";
    public static MOUSE_OVER:string = "pointerover";
    public static MOUSE_OUT:string = "pointerout";
    public static MOUSE_MOVE:string = "pointermove";
    public static MOUSE_DOWN:string = "pointerdown";        
    public static MOUSE_ENTER:string = "mouseenter";
    public static MOUSE_LEAVE:string = "mouseleave";
    public static MOUSE_WHEEL:string = "mousewheel";

    public altKey:boolean;
    public buttonDown:boolean;
    public clickCount:number;
    public commandKey:boolean;
    public controlKey:boolean;
    public ctrlKey:boolean;
    public delta:number;
    public isRelatedObjectInaccessible:boolean;
    public localX:number;
    public localY:number;
    public movementX:number;
    public movementY:number;
    public mouseX:number = 0;
    public mouseY:number = 0;
    public alrelatedObjecttKey:any;
    public shiftKey:boolean;
    public stageX:number;
    public stageY:number;
    public data:PIXI.interaction.InteractionData;
    public touchID:number;


}