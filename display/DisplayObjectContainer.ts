import { Event } from '../events/Event';
import { MouseEvent } from '../events/MouseEvent';
import { Point } from '../geom/Point';
import { DisplayObject } from './DisplayObject';

export class DisplayObjectContainer extends DisplayObject
{
    
    private static mouseWheelRegister:DisplayObjectContainer[] = [];
    protected _children:DisplayObject[];
    protected _interactionData:any;
    protected _dragAnchor:Point;
    protected _touchIdentifier:number;
    protected _cachedData:PIXI.interaction.InteractionData;

    constructor()
    {
        super();
        this._touchIdentifier = -1;
        this._dragAnchor = new Point();
        this._children = [];        
    }

    public removeChildren():void
    {
        while(this._children.length)
        {
            var child:DisplayObject = this._children.shift();
            this._innerCompContainer.removeChild(child._innerCompContainer);
            DisplayObject.removeFromDisplayList(child, this); 
        }
    }

    public get numChildren():number
    {
        return this._innerCompContainer.children.length;
    }

    public getChildIndex(child:DisplayObject):number
    {
        return this._innerCompContainer.getChildIndex(child._innerCompContainer);
    }

    public getChildByName(name:string):DisplayObject
    {
        for(var i:number = 0; i < this._children.length; i++)
        {
            if(this._children[i].name == name)
            {
                return this._children[i];
            }
        }
        return null;
    }

    public addChildAt(child:DisplayObject, index:number):DisplayObject
    {
        if(index < 0 || index >= this._children.length)
        {
            return this.addChild(child);
        }
        this._children.splice(index, 0, child);
        this._innerCompContainer.addChildAt(child._innerCompContainer, index);
        DisplayObject.addToDisplayList(child, this);
        return child;
    }

    public addChild(child:DisplayObject):DisplayObject
    {
        if(!child)
        {
            return;
        }
        var index:number = this._children.indexOf(child);
        if(index >= 0)
        {
            this._children.splice(index, 1);
        }
        if(child.parent)
        {
            child.parent.removeChild(child);
        }
        this._children.push(child);
        this._innerCompContainer.addChild(child._innerCompContainer);
        DisplayObject.addToDisplayList(child, this);
        return child;
    }

    public getChildAt(index:number):DisplayObject
    {
        if(index < 0 || index >= this._children.length)
        {
            return null;
        }
        return this._children[index];
    }

    public removeChildAt(index:number):DisplayObject
    {
        if(index < 0 || index >= this._children.length)
        {
            return null;
        }
        var child:DisplayObject = this._children[index];
        return this.removeChild(child);
    }

    public removeChild(child:DisplayObject):DisplayObject
    {
        var index:number = this._children.indexOf(child);
        if(index >= 0)
        {
            this._children.splice(index, 1);
            this._innerCompContainer.removeChild(child._innerCompContainer);
            DisplayObject.removeFromDisplayList(child, this);            
            return child;
        }        
        return child;
    }

    public removeEventListener(type:string, listener:Function, useCapture:boolean = false)
    {
        this._innerCompContainer.off(type, this.nativeEventReceiver);
        super.removeEventListener(type, listener);                     
        if(type == MouseEvent.MOUSE_WHEEL)
        {
            var index:number = DisplayObjectContainer.mouseWheelRegister.indexOf(this);
            if(index >= 0)
            {
                DisplayObjectContainer.mouseWheelRegister.splice(index, 1);
            }
        }
    }

    public addEventListener(type:string, listener:Function, scope:any = null, priority:number = 0, weakReference:boolean = false):void
    {        
        if(this.isRegistered(type, listener))
        {
            return;
        }
        this._innerCompContainer.on(type, this.nativeEventReceiver); 
        super.addEventListener(type, listener, scope);  
        if(type == MouseEvent.MOUSE_WHEEL)
        {
            DisplayObjectContainer.mouseWheelRegister.push(this);                
            document.addEventListener("mousewheel", function(event)
            {
                DisplayObjectContainer.onMouseWheelBlock(event);
            }, false);
        }
    }

    protected onMouseWheelData(event:any):void
    {
        
    }

    private static onMouseWheelBlock = (event)=>
    {
        for(var i:number = 0; i <DisplayObjectContainer.mouseWheelRegister.length; i++)
        {
            var container:DisplayObjectContainer = DisplayObjectContainer.mouseWheelRegister[i];
            if(container && container.stage)
            {
                var ctransform = container._innerCompContainer.worldTransform;
                var posx:number = ctransform.tx || 0;
                var posy:number = ctransform.ty || 0;
                var scale = container._innerCompContainer.scale || new Point(1, 1);
                var cwidth:number = container._innerCompContainer.width * scale.x;
                var cheight:number = container._innerCompContainer.height * scale.y;
                var stageX:number = container.stage.mouseX;
                var stageY:number = container.stage.mouseY;
                if(stageX >= posx && stageY >= posy)
                {
                    if(stageX <= posx + cwidth && stageY <= posy + cheight)
                    {
                        container.onMouseWheelData(event);
                    }
                }
            }            
        }
    }

    public dispatchEvent(event: Event):void
    {
        super.dispatchEvent(event);
    }

    public getChildrenUnderMouse():DisplayObject
    {
        for(var i:number = this.numChildren; i >= 0; i--)
        {
            var child:DisplayObject = this.getChildAt(i);
            if(child)
            {
                if(child.isUnderMouse())
                {
                    if(child instanceof DisplayObjectContainer)
                    {
                        return child.getChildrenUnderMouse();
                    }
                    else
                    {
                        return child;
                    }
                }
            }            
        }
        return this;
    }

    public static clearEvents():void
    {
        
    }

    private nativeEventReceiver = (event:PIXI.interaction.InteractionEvent) =>
    {
        var pos:any;
        if(event)
        {        
            var dispatchedEvent:MouseEvent = new MouseEvent(event.type);            
            dispatchedEvent.currentTarget = this;
            dispatchedEvent._legacyTarget = event.target;
            var touchelement:Touch = null;
            if(event.data)
            {        
                try 
                {
                    if(event.type == MouseEvent.MOUSE_DOWN)
                    {
                        this._cachedData = event.data;
                    }
                    else if(event.type == MouseEvent.MOUSE_UP)
                    {
                        this._cachedData = null;
                    } 
                    pos = new PIXI.Point();
                    if(this._innerCompContainer.parent)
                    {
                        pos = event.data.getLocalPosition(this._innerCompContainer.parent)
                    }                    
                    dispatchedEvent.mouseX = pos.x;
                    dispatchedEvent.mouseY = pos.y;
                    dispatchedEvent.data = event.data;
                    this._mouseX = dispatchedEvent.mouseX;
                    this._mouseY = dispatchedEvent.mouseY;
                    if(event.data.originalEvent)
                    {                       
                        dispatchedEvent.altKey = event.data.originalEvent.altKey;
                        dispatchedEvent.commandKey = event.data.originalEvent.ctrlKey;
                        dispatchedEvent.controlKey = event.data.originalEvent.ctrlKey;
                        dispatchedEvent.ctrlKey = event.data.originalEvent.ctrlKey;
                        dispatchedEvent.delta = 0;
                        dispatchedEvent.isRelatedObjectInaccessible = false;  
                        dispatchedEvent.localX = pos.x - this.x;
                        dispatchedEvent.localY = pos.y - this.y;                   
                        dispatchedEvent.alrelatedObjecttKey = null;
                        dispatchedEvent.shiftKey = event.data.originalEvent.shiftKey;
                        dispatchedEvent.stageX =  event.data.global.x - this.stage.absoluteX;
                        dispatchedEvent.stageY = event.data.global.y - this.stage.absoluteY;        
                    }    
                } 
                catch (error) 
                {
                    
                }                
            }
            this.dispatchEvent(dispatchedEvent);
        }
    }   
}
