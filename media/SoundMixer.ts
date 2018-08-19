
export class SoundMixer
{
    public static _context:AudioContext;
    public static ALLOW_FALLBACK:boolean = true;
    public static LEGACYMODE:boolean = false;

    public static get isAvailable():boolean
    {
        if(SoundMixer._context != null)
        {
            return true;
        }
        return false;
    }

    public static get context():MixerAudioContext
    {
        if(!SoundMixer._context)
        {
            var audioClass = (window['AudioContext'] || window['webkitAudioContext'] || window['mozAudioContext'] || window['oAudioContext'] || window['msAudioContext']);

            // test
            //audioClass = null;


            if (audioClass)
            {
                SoundMixer._context = new audioClass(); 
                var oscillator = SoundMixer._context.createOscillator();
                oscillator.frequency.value = 400;
                var gainControl = SoundMixer.context.createGain();
                gainControl.gain.value = 0;
                oscillator.connect(gainControl);
                gainControl.connect(SoundMixer._context.destination);
                oscillator.start(0);            
                oscillator.stop(5); 
            }
            else if(SoundMixer.ALLOW_FALLBACK)
            {
                SoundMixer.LEGACYMODE = true;
            }
        }        
        return SoundMixer._context;
    }
}

interface MixerAudioContext
{
    decodeAudioData(response, onData:Function, onError:Function);
    createBufferSource():AudioBufferSourceNode;
    createGain():GainNode;
    createAnalyser():AnalyserNode;
    createScriptProcessor(bufferSize:number, numberOfInputChannels:number, numberOfOutputChannels:number):ScriptProcessorNode;
    destination:AudioNode;
}