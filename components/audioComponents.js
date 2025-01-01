import {Howl, Howler} from 'howler';
let audioOn =true;
let audioSrc = new URL('../sound/actionbuton.wav',import.meta.url);
let audioSrc2 = new URL('../sound/bombCounter.wav',import.meta.url);
let audioSrc3 = new URL('../sound/bombExplode.mp3',import.meta.url);
let audioSrc4 = new URL('../sound/bouton.wav',import.meta.url);
let audioSrc5 = new URL('../sound/coin.wav',import.meta.url);
let audioSrc6 = new URL('../sound/key.mp3',import.meta.url);

let actionAudio = new Howl({
    src: [audioSrc.href]
  });

let bombCounterAudio=new Audio(audioSrc2.href);
let bombExplodeAudio=new Howl({
  src: [audioSrc3.href]
});

let buttonAudio = new Howl({
    src: [audioSrc4.href]
  });
let coinAudio=new Audio(audioSrc5.href);

let keyAudio = new Howl({
  src: [audioSrc6.href],
  loop:true,
});


export class AudioManage{

    constructor(){

    }
   static  init(){}
   static soundONOFF(state)
   {


    if(state == 'ON_MENU')
    {
      audioOn = true;
      
    }
    else if(state =='OFF_MENU')
    {
      audioOn = false;
      
    }
   }
   static play(audio){
      if(audioOn)
      {
        if(audio=='actionButton'){actionAudio.play()} 
        if(audio=='bombCounter'){bombCounterAudio.play()} 
        if(audio=='bombExplode'){bombExplodeAudio.play()} 
        if(audio=='click'){buttonAudio.play()} 
        if(audio=='coin'){coinAudio.play()} 
        if(audio=='key'){keyAudio.play()} 

      }

    }
    static playAmbient(state)
    {
      if(audioOn)
      {
        if(state == 'play')
        {
          ambient.play()
        }
        else if(state == 'pause')
        {
          ambient.pause()
        }
        else if(state=='stop')
        {
          ambient.stop()
        }
      }

      
    }
}