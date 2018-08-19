import { Event } from './Event';
import { IEventDispatcher } from "./IEventDispatcher";
import { Tracer } from '../../superduperinc/flash/log/Tracer';
import { MouseEvent } from './MouseEvent';

export class EventDispatcher implements IEventDispatcher
{
    private static instanceCount:number = 0;

    public instanceName:string;
    protected _className:string;
    protected _name:string;
    protected registeredListeners:EventReference;
    protected _isLogAllowed:boolean;

    constructor(dispatcher:IEventDispatcher = null)
    {
        this.instanceName = 'instance_' + EventDispatcher.instanceCount++;
        this._name = this.instanceName;
        this.registeredListeners = {};
        this._className = this.constructor['name'];     
    }

    public revealMethods(value:any):void
    {
        if(!this._isLogAllowed)
        {
            return;
        }
    }

    public reveal(value:any):void
    {
        if(!this._isLogAllowed)
        {
            return;
        }
    }

    public show(value:any):void
    {
        if(!this._isLogAllowed)
        {
            return;
        }
    }

    public removeListeners(exceptions:any = null)
    {
        for(var i in this.registeredListeners)
        {
            delete this.registeredListeners[i];       
        }
        this.registeredListeners = {};
    }

    public hasEventListener(type:string):boolean
    {      
        if(this.registeredListeners[type] != null)
        {
            var methods:MethodScope[] = this.registeredListeners[type];
            if(methods && methods.length)
            {
                return true;
            }
            return false;
        }        
        return false;
    }

    public removeEventListener(type:string, listener:Function, useCapture:boolean = false)
    {
        if(this.registeredListeners[type] != null)
        {
            var methods:MethodScope[] = this.registeredListeners[type];
            if(methods && methods.length)
            {                
                for(var i:number = 0; i < methods.length; i++)
                {
                    if(methods[i].objectFunction == listener)
                    {
                        methods.splice(i, 1);
                        return;
                    }
                }
            }
            if(!methods.length)
            {
                delete this.registeredListeners[type];
            }
        }
    }

    public dispatchEvent(event:Event):void
    {        
        if(this.registeredListeners[event.type] != null)
        {            
            event.currentTarget = this;
            var methods:MethodScope[] = this.registeredListeners[event.type];  
            if(methods && methods.length)
            {
                let methodcopy:MethodScope[] = methods.concat();
                methodcopy = this.getUniqueScopes(methodcopy);                
                while(methodcopy.length)
                {                    
                    var method:MethodScope = methodcopy.shift();
                    if(method)
                    {                        
                        this.trigger(method, event);                        
                    }                    
                }
            }
        }
    }

    protected getUniqueScopes(scopes:MethodScope[]):MethodScope[]
    {
        let strippedscopes:MethodScope[] = [];
        while(scopes.length)
        {
            let method:MethodScope = scopes.shift();
            let isDuplicate:boolean;
            for(let i:number = 0; i < strippedscopes.length; i++)
            {
                if(strippedscopes[i].objectFunction === method.objectFunction && strippedscopes[i].scope === method.scope)
                {
                    isDuplicate = true;
                }
            }
            if(!isDuplicate)
            {
                strippedscopes.push(method);
            }
        }
        return strippedscopes;
    }

    protected trigger(method:MethodScope, event:Event)
    {
        if(method.objectFunction)
        {
            method.objectFunction.call(method.scope, event);
        }        
    }

    protected isRegistered(type:string, listener:Function):boolean
    {
        if(!this.registeredListeners[type])
        {
            return false;
        }
        var methods:MethodScope[] = this.registeredListeners[type];
        for(var i:number = 0; i < methods.length; i++)
        {
            if(methods[i].objectFunction == listener)
            {
                return true;
            }
        }
        return false;
    }

    public addEventListener(type:string, listener:Function, scope:any = null, priority:number = 0, weakreference:boolean = false):void
    {       
        if(!this.registeredListeners[type])
        {
            this.registeredListeners[type] = [];
        }
        var methods:MethodScope[] = this.registeredListeners[type];
        for(var i:number = 0; i < methods.length; i++)
        {
            if(methods[i].objectFunction == listener)
            {
                return;
            }
        }
        var methodScope:MethodScope = new MethodScope();
        methodScope.objectFunction = listener;
        methodScope.scope = scope;
        if(!scope)
        {
            methodScope.scope = this;
        }       
        methods.push(methodScope);            
    }

    public getType():string
    {
        return this.constructor['name'];
    }

    
}

interface EventReference
{
    [name:string]: MethodScope[];
}

class MethodScope
{
    public objectFunction:Function;
    public scope:any;
}