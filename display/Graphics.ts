import { Matrix } from '../geom/Matrix';

export class Graphics extends PIXI.Graphics
{
    constructor()
    {
        super();
        this.moveTo(0, 0);       
    }
    
    public drawRoundRect(posX:number, posY:number, width:number, height:number, leftRadius:number, rightRadius:number):void
    {
        this.drawRoundedRect(posX, posY, width, height, leftRadius);
    }

    public drawRoundRectComplex(posX:number, posY:number, width:number, height:number, topLeft:number, topRight:number, bottomLeft:number, bottomRight:number):void
    {
        this.drawRoundedRect(posX, posY, width, height, topLeft);
    }

    public beginGradientFill(type:string, colors:any[], alphas:any[], ratios:any[], matrix:Matrix = null, spreadMethod:string = "pad", interpolationMethod:string = "rgb", focalPointRatio:number = 0):void
    {

    }
}