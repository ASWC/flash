import { SQLResult } from "./SQLResult";
import { SQLConnection } from "./SQLConnection";

export class SQLStatement
{
    public get parameters():any[]
    {
        return null;
    }

    public getResult():SQLResult
    {
        return null;
    }

    public execute():void
    {

    }
    
    public set text(value:string)
    {

    }

    public get text():string
    {
        return null;
    }

    public set sqlConnection(value:SQLConnection)
    {

    }

    public get sqlConnection():SQLConnection
    {
        return null;
    }
}