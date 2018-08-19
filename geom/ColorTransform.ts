
export class ColorTransform
{
    public alphaMultiplier:number;
    public blueMultiplier:number;
    public greenMultiplier:number;
    public redMultiplier:number;
    public redOffset:number;
    public greenOffset:number;
    public blueOffset:number;
    public alphaOffset:number;

    constructor(redMultiplier:number = 1.0, greenMultiplier:number = 1.0, blueMultiplier:number = 1.0, alphaMultiplier:number = 1.0, redOffset:number = 0, greenOffset:number = 0, blueOffset:number = 0, alphaOffset:number = 0)
    {
        this.alphaMultiplier = alphaMultiplier;
        this.blueMultiplier = blueMultiplier;
        this.greenMultiplier = greenMultiplier;
        this.redMultiplier = redMultiplier;
        this.redOffset = redOffset;
        this.greenOffset = greenOffset;
        this.blueOffset = blueOffset;
        this.alphaOffset = alphaOffset;
    }

    public set color(value:number)
    {

    }
    
}