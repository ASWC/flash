import * as WebFont from "webfontloader";
import { WebFontConfig } from "./WebFontConfig";

export class FontManager
{
	public static init(config:WebFontConfig):void
	{
		WebFont.load(config)
	}
}