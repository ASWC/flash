import { PerspectiveProjection } from './PerspectiveProjection';
import { Matrix3D } from './Matrix3D';
import { Matrix } from './Matrix';
import { ColorTransform } from './ColorTransform';
import { Rectangle } from './Rectangle';
import { DisplayObject } from '../display/DisplayObject';

export class Transform
{
    protected _delegate:DisplayObject;
    protected _pixelBounds:Rectangle;
    protected _colorTransform:ColorTransform;
    protected _concatenatedMatrix:Matrix;
    protected _matrix:Matrix;
    protected _matrix3D:Matrix3D;
    protected _perspectiveProjection:PerspectiveProjection;

    constructor()
    {
        this._colorTransform = new ColorTransform(); 
        this._concatenatedMatrix = new Matrix(); 
        this._matrix = new Matrix(); 
        this._matrix3D = new Matrix3D(); 
        this._perspectiveProjection = new PerspectiveProjection(); 
        this._pixelBounds = new Rectangle();   
    }

    public get pixelBounds():Rectangle
    {
        return this._pixelBounds;
    }

    public get colorTransform():ColorTransform
    {
        return this._colorTransform; 
    }

    public set colorTransform(value:ColorTransform)
    {
        this._colorTransform = value;
        if(this._delegate)
        {
            
        }
    }

    public get concatenatedColorTransform():ColorTransform
    {
        return this._colorTransform; 
    }

    public get concatenatedMatrix():Matrix
    {
        return this._concatenatedMatrix;
    }

    public get matrix():Matrix
    {
        return this.matrix;
    }

    public set matrix(value:Matrix)
    {
        this.matrix = value;
    }

    public get matrix3D():Matrix3D
    {
        return this._matrix3D;
    }

    public set matrix3D(value:Matrix3D)
    {
        this._matrix3D = value;
    }

    public get perspectiveProjection():PerspectiveProjection
    {
        return this._perspectiveProjection;
    }

    public set perspectiveProjection(value:PerspectiveProjection)
    {
        this._perspectiveProjection = value;
    }

    public static setDelegate(target:DisplayObject, transform:Transform)
    {
        transform._delegate = target;        
    }
    
}