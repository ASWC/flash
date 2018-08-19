import { PrintJobOptions } from './PrintJobOptions';
import { Rectangle } from './../geom/Rectangle';
import { Sprite } from './../display/Sprite';
import { Stage } from './../display/Stage';

export class PrintJob
{
    private pageInqueue:any[];

    constructor()
    {
        this.pageInqueue = [];
    }

    public addPage(sprite:Sprite, printArea:Rectangle = null, options:PrintJobOptions = null, frameNum:number = 0):void
    {
        var image:HTMLImageElement = Stage.takeScreenShot(sprite);
        if(image)
        {
            this.pageInqueue.push(image);
        }
    }

    public send():void
    {

    }

    public start():boolean
    {
        var frame1 = document.createElement('iframe');
    	frame1.name = "frame1";  
    	frame1.style.position = "absolute";
    	frame1.style.top = "-1000000px";
    	document.body.appendChild(frame1);
		var frameDoc = frame1.contentWindow ? frame1.contentWindow : frame1.contentDocument['document'] ? frame1.contentDocument['document'] : frame1.contentDocument;
    	frameDoc.document.open();
    	frameDoc.document.write('<html><head><title></title>');
        frameDoc.document.write('</head><body>');
        for(var i = 0; i < this.pageInqueue.length; i++)
        {
            frameDoc.document.write("<div width='100%' height='100%'><img width='100%' src='" + this.pageInqueue[i].src + "' ></div>");
        }    	
    	frameDoc.document.write('</body></html>');
    	frameDoc.document.close();
    	setTimeout(function () 
		{
        	window.frames["frame1"].focus();
        	window.frames["frame1"].print();
        	document.body.removeChild(frame1);
        }, 500);
        return false;
    }
}