import { MouseEvent } from './../events/MouseEvent';
import { Rectangle } from './../geom/Rectangle';
import { DisplayObjectContainer } from './DisplayObjectContainer';

export class Sprite extends DisplayObjectContainer
{
    protected _lockCenter:boolean;
    protected _dragArea:Rectangle;
    protected dragging:boolean;

   constructor()
   {
       super();
       this.dragging = false;
       this.interactive = true;        
   }    

   public get buttonMode():boolean
   {
       return this._innerCompContainer.buttonMode;
   }

   public set buttonMode(value:boolean)
   {
       this._innerCompContainer.buttonMode = value;
   }

   public startDrag(lockCenter:boolean = false, bounds:Rectangle = null):void
   {
        this.dragging = true;
        this._lockCenter = lockCenter;
        this._dragArea = bounds;
        this.addEventListener(MouseEvent.MOUSE_MOVE, this.handleMove);        
        if(this._cachedData)
        {
            let pos:PIXI.Point = this._cachedData.getLocalPosition(this._innerCompContainer);
            this._dragAnchor.x = pos.x;
            this._dragAnchor.y = pos.y;
        }
   }

   protected handleMove = (event:MouseEvent)=>
   {
       if(this.dragging)
       {
           if(this._cachedData && this._innerCompContainer.parent)
           {
                let pos:PIXI.Point = this._cachedData.getLocalPosition(this._innerCompContainer.parent);
                if(this._lockCenter)
                {
                    this._innerCompContainer.x = pos.x - (this.width / 2);
                    this._innerCompContainer.y = pos.y - (this.height / 2);
                }
                else
                {
                    this._innerCompContainer.x = pos.x - this._dragAnchor.x;
                    this._innerCompContainer.y = pos.y - this._dragAnchor.y;
                }
                if(this._dragArea)
                {
                    if(this._innerCompContainer.x < this._dragArea.x)
                    {
                        this._innerCompContainer.x = this._dragArea.x;
                    }
                    if(this._innerCompContainer.y < this._dragArea.y)
                    {
                        this._innerCompContainer.y = this._dragArea.y;
                    }
                    if(this._innerCompContainer.x + this.width > this._dragArea.x + this._dragArea.width)
                    {
                        this._innerCompContainer.x = this._dragArea.x + this._dragArea.width - this.width;
                    }
                    if(this._innerCompContainer.y + this.height > this._dragArea.y + this._dragArea.height)
                    {
                        this._innerCompContainer.y = this._dragArea.y + this._dragArea.height - this.height;
                    }
                }
           }          
       }        
   }

   public stopDrag():void
   {
        this.dragging = false;
        this.removeEventListener(MouseEvent.MOUSE_MOVE, this.handleMove);
   }








   
   
}