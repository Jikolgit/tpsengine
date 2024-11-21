import {Howl, Howler} from 'howler';
let audioOn =true;
let audioSrc = new URL('../sound/bow_shoot.wav',import.meta.url);
let audioSrc2 = new URL('../sound/bow_hit.wav',import.meta.url);
let audioSrc3 = new URL('../sound/walk_6.wav',import.meta.url);
let audioSrc4 = new URL('../sound/playerhit.wav',import.meta.url);
let audioSrc5 = new URL('../sound/toggle_001.ogg',import.meta.url);
let audioSrc6 = new URL('../sound/dungeon2.wav',import.meta.url);
let audioSrc7 = new URL('../sound/heal.wav',import.meta.url);
let audioSrc9 = new URL('../sound/coin_1.wav',import.meta.url);
let audioSrc10 = new URL('../sound/rollover1.ogg',import.meta.url);
let audioSrc11 = new URL('../sound/crateimpact.wav',import.meta.url);

let hitAudio = new Howl({
    src: [audioSrc.href]
  });
hitAudio.volume(0.2)
let shootAudio=new Audio(audioSrc2.href);
let walkAudio=new Audio(audioSrc3.href);

let playerhitAudio = new Howl({
    src: [audioSrc4.href]
  });
let clickAudio=new Audio(audioSrc5.href);

let ambient = new Howl({
  src: [audioSrc6.href],
  loop:true,
});

let heal = new Howl({
  src: [audioSrc7.href],
  
});
let takeCoin = new Howl({
  src: [audioSrc9.href],
  
});
let uiErrorAudio = new Howl({
  src: [audioSrc10.href],
  
});
let crateimpactAudio = new Howl({
  src: [audioSrc11.href],
  
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
        if(audio=='shoot'){hitAudio.play()} 
        else if(audio=='hit'){shootAudio.play()} 
        else if(audio=='walk'){walkAudio.play()} 
        else if(audio=='playerhit'){playerhitAudio.play()} 
        else if(audio=='click'){clickAudio.play()} 
        else if(audio=='click-Error'){uiErrorAudio.play()} 
        else if(audio=='heal'){heal.play()} 
        else if(audio=='coin'){takeCoin.play()} 
        else if(audio=='crate-impact'){crateimpactAudio.play()} 
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