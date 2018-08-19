import { Event } from '../events/Event';
import { Point } from '../geom/Point';
import { Transform } from '../geom/Transform';
import { LoaderInfo } from './LoaderInfo';
import { Graphics } from './Graphics';
import { DisplayObjectContainer } from './DisplayObjectContainer';
import { Rectangle } from '../geom/Rectangle';
import { EventDispatcher } from "../events/EventDispatcher";
import { Stage } from './Stage';
import { MouseEvent } from '../events/MouseEvent';

export class DisplayObject extends EventDispatcher
{
    private static _pixiset:boolean = false;
    private static mouseCheck:Rectangle = new Rectangle();
    private static nameCount:number = 0;    
    public _parent:DisplayObjectContainer;
    public _stage:Stage;
    public _innerCompContainer:PIXI.Container;
    public _graphics:Graphics;
    protected _loaderInfo:LoaderInfo;
    protected _transform:Transform;  
    protected _mouseX:number = 0;
    protected _mouseY:number = 0;  
    protected _allowDragging:boolean;

    constructor()
    {
        super();
        this._allowDragging = true;
        this._transform = new Transform();
        Transform.setDelegate(this, this._transform);
        DisplayObject.nameCount++;
        this._name = "instance_" + DisplayObject.nameCount;
        this._innerCompContainer = new PIXI.Container();   
        this.interactive = true;     
        this._innerCompContainer.on(MouseEvent.MOUSE_DOWN, this.assigntarget);        
        DisplayObject.setPIXI();
    }   

    public set allowDragging(value:boolean)
    {
        this._allowDragging = value;
    }

    public get allowDragging():boolean
    {
        return this._allowDragging;
    }

    protected static setPIXI():void
    {
        if(DisplayObject._pixiset)
        {
            return;
        }
        DisplayObject._pixiset = true;
        PIXI.Graphics.prototype.drawRect = function(x, y, width, height):PIXI.Graphics
        {
            this.moveTo(x,y);
            this.lineTo(x + width,y);
            this.lineTo(x + width,y + height);
            this.lineTo(x,y + height);
            this.lineTo(x,y);
            return this;
        }
        PIXI.Sprite.prototype.calculateVertices = function ()
        {
            if(!this._texture)
            {
                return;
            }
            if(!this._texture.orig)
            {
                return;
            }
            if(this._transformID === this.transform._worldID && this._textureID === this._texture._updateID)
            {
                return;
            }
            this._transformID = this.transform._worldID;
            this._textureID = this._texture._updateID;
            var texture = this._texture,
                wt = this.transform.worldTransform,
                a = wt.a, b = wt.b, c = wt.c, d = wt.d, tx = wt.tx, ty = wt.ty,
                vertexData = this.vertexData,
                w0, w1, h0, h1,
                trim = texture.trim,
                orig = texture.orig;
            if (trim)
            {
                w1 = trim.x - this.anchor._x * orig.width;
                w0 = w1 + trim.width;
                h1 = trim.y - this.anchor._y * orig.height;
                h0 = h1 + trim.height;
            }
            else
            {
                w0 = orig.width * (1-this.anchor._x);
                w1 = orig.width * -this.anchor._x;
                h0 = orig.height * (1-this.anchor._y);
                h1 = orig.height * -this.anchor._y;
            }
            vertexData[0] = a * w1 + c * h1 + tx;
            vertexData[1] = d * h1 + b * w1 + ty;
            vertexData[2] = a * w0 + c * h1 + tx;
            vertexData[3] = d * h1 + b * w0 + ty;
            vertexData[4] = a * w0 + c * h0 + tx;
            vertexData[5] = d * h0 + b * w0 + ty;
            vertexData[6] = a * w1 + c * h0 + tx;
            vertexData[7] = d * h0 + b * w1 + ty;
        }
        PIXI.Sprite.prototype.containsPoint = function containsPoint(point) {
            if(!this._texture)
            {
                return false;
            }
            if(!this._texture.orig)
            {
                return false;
            }
            var tempPoint = new PIXI.Point()
            this.worldTransform.applyInverse(point, tempPoint);    
            var width = this._texture.orig.width;
            var height = this._texture.orig.height;
            var x1 = -width * this.anchor.x;
            var y1 = 0;
    
            if (tempPoint.x >= x1 && tempPoint.x < x1 + width) {
                y1 = -height * this.anchor.y;
    
                if (tempPoint.y >= y1 && tempPoint.y < y1 + height) {
                    return true;
                }
            }
    
            return false;
        };
    }

    protected assigntarget = (event)=>
    {
        
    }

    public isUnderMouse():boolean
    {        
        if(!this.stage)
        {
            return false;
        }
        var trasnform:PIXI.Matrix = this._innerCompContainer.worldTransform;
        DisplayObject.mouseCheck.x = trasnform.tx;
        DisplayObject.mouseCheck.y = trasnform.ty;
        DisplayObject.mouseCheck.width = this.width;
        DisplayObject.mouseCheck.height = this.height;
        if(DisplayObject.mouseCheck.contains(this.stage.mouseX, this.stage.mouseY))
        {
            return true;
        }
        return false;
    }

    public getObjectsUnderPoint(position:Point):DisplayObject[]
    {
        return null;
    }

    public getRect(targetCoordinateSpace:DisplayObject):Rectangle
    {
        var rect:PIXI.Rectangle = this._innerCompContainer.getBounds(true);
        return new Rectangle(rect.x, rect.y, rect.width, rect.height);
    }

    public getBounds(targetCoordinateSpace:DisplayObject):Rectangle
    {
        return null;
    }

    public localToGlobal(coordinates:Point):Point
    {
        return null;
    }

    public set cacheAsBitmap(value:boolean)
    {
        this._innerCompContainer.cacheAsBitmap = value;
    }

    public get cacheAsBitmap():boolean
    {
        return this._innerCompContainer.cacheAsBitmap;
    }    

    public get mouseY():number
    {
        return this._mouseY;
    }

    public get mouseX():number
    {
        return this._mouseX;
    }

    public set filters(value:any[])
    {
        this._innerCompContainer.filters = value;
    }

    public get filters():any[]
    {
        return this._innerCompContainer.filters;
    }

    public get transform():Transform
    {
        return this._transform;
    }

    public static setGraphic(item:DisplayObject, graphic:Graphics):void
    {
        item._graphics = graphic;
        item._innerCompContainer.addChildAt(item.graphics, 0);
    }

    public get graphics():Graphics
    {
        if(!this._graphics)
        {
            this._graphics = new Graphics();
            this._innerCompContainer.addChildAt(this.graphics, 0);
        }
        return this._graphics;
    }

    public set mask(value:DisplayObject)
    {
        if(value)
        {
            if(value.graphics)
            {
                this._innerCompContainer.mask = value.graphics;
            }
        }
        else
        {
            this._innerCompContainer.mask = null;
        }
    }

    public get loaderInfo():LoaderInfo
    {
        if(!this._loaderInfo)
        {
            this._loaderInfo = new LoaderInfo();
        }
        return this._loaderInfo;
    }
    
    public get tabEnabled():boolean
    {
        return false;
    }

    public set tabEnabled(value:boolean)
    {
        
    }

    public get tabChildren():boolean
    {
        return false;
    }

    public set tabChildren(value:boolean)
    {
        
    }

    public get useHandCursor():boolean
    {
        return false;
    }

    public set useHandCursor(value:boolean)
    {
        
    }

    
    public set focus(value:DisplayObject)
    {
        
    }

    public get mouseChildren():boolean
    {
        return this._innerCompContainer.interactiveChildren;
    }

    public set mouseChildren(value:boolean)
    {
        this._innerCompContainer.interactiveChildren = value;
    }

    public get mouseEnabled():boolean
    {
        return this._innerCompContainer.interactive;
    }

    public set mouseEnabled(value:boolean)
    {
        this._innerCompContainer.interactive = value;
    }

    public get interactive():boolean
    {
        return this._innerCompContainer.interactive;
    }

    public set interactive(value:boolean)
    {
        this._innerCompContainer.interactive = value;
    }

    public get visible():boolean
    {
        return this._innerCompContainer.visible;
    }

    public set visible(value:boolean)
    {
        this._innerCompContainer.visible = value;
    }

    public get rotation():number
    {
        return this._innerCompContainer.rotation / Math.PI * 180.0;
    }

    public set rotation(value:number)
    {
        this._innerCompContainer.rotation = value / 180.0 * Math.PI;
    }

    public get scaleY():number
    {
        return this._innerCompContainer.scale.y;
    }

    public set scaleY(value:number)
    {
        this._innerCompContainer.scale.y = value;
    }

    public get scaleX():number
    {
        return this._innerCompContainer.scale.x;
    }

    public set scaleX(value:number)
    {
        this._innerCompContainer.scale.x = value;
    }

    public get height():number
    {
        return this._innerCompContainer.height;
    }

    public set height(value:number)
    {
        this._innerCompContainer.height = value;
    }

    public get width():number
    {
        return this._innerCompContainer.width;
    }

    public set width(value:number)
    {
        this._innerCompContainer.width = value;        
    }

    public get x():number
    {
        if(this._innerCompContainer)
        {
            return this._innerCompContainer.x;
        }
        return 0;
    }

    public set x(value:number)
    {        
        this._innerCompContainer.x = value;
    }

    public get y():number
    {
        if(this._innerCompContainer)
        {
            return this._innerCompContainer.y;
        }
        return 0;
    }

    public set y(value:number)
    {
        this._innerCompContainer.y = value;
    }

    public set alpha(value:number)
    {
        this._innerCompContainer.alpha = value;
    }

    public get alpha():number
    {
        return this._innerCompContainer.alpha;
    }

    public get stage():Stage
    {
        return this._stage;
    }

    public set stage(value:Stage)
    {
        this._stage = value;       
        if(this instanceof DisplayObjectContainer)
        {
            if(this.numChildren > 0)
            {
                for(var i:number = 0; i < this.numChildren; i++)
                {
                    this.getChildAt(i)._stage = this._stage; 
                }
            }
        }              
    }

    public get parent():DisplayObjectContainer
    {
        return this._parent;
    }

    public set parent(value:DisplayObjectContainer)
    {
        this._parent = value;
    }

    public static removeFromDisplayList(child:DisplayObject, parent:DisplayObject):void
    {
        if(child && child.stage)
        {            
            if(child.hasEventListener(Event.REMOVED_FROM_STAGE))
            {
                child.dispatchEvent(new Event(Event.REMOVED_FROM_STAGE));
            }   
            var container:DisplayObjectContainer = <DisplayObjectContainer> child;
            if(container)
            {
                for(var i:number = 0; i < container.numChildren; i++)
                {
                    DisplayObject.removeFromDisplayList(container.getChildAt(i), container);
                } 
            }   
            Event.unregisterDisplayObject(child);
            child._parent = null;
            child._stage = null;      
        }        
    }

    public static addToDisplayList(child:DisplayObject, parent:DisplayObjectContainer):void
    {
        if(!child || !parent)
        {
            return;
        }
        child._parent = parent;
        child._stage = parent._stage;
        if(child._stage)
        {
            Event.registerDisplayObject(child);
            if(child.hasEventListener(Event.ADDED_TO_STAGE))
            {
                child.dispatchEvent(new Event(Event.ADDED_TO_STAGE));
            }
            var container:DisplayObjectContainer = <DisplayObjectContainer> child;
            if(container)
            {
                for(var i:number = 0; i < container.numChildren; i++)
                {
                    DisplayObject.addToDisplayList(container.getChildAt(i), container);
                } 
            }
        }
    }

    public get name():string
    {
        return this._name;
    }

    public set name(value:string)
    {
        this._name = value;
    }   

    
}

