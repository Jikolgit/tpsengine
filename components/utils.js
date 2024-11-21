import cryptoJs from "crypto-js";

export class CustomCounter
{
    constructor(timer,repetitionLimit,callBackFunc,callBackFunc2)
    {
        this.startEffect=false;
        this.repetition = 0;
        this.repetitionLimit = repetitionLimit
        this.initialTimer = timer;
        this.timer=timer;
        this.callBackFunc = callBackFunc;
        this.callBackFunc2 = callBackFunc2;
        this.counterOver = null;
        this.animationContainer = null
    }
    start = ()=>
    {
        
        this.timer --;
        if(this.timer == 0)
        {
            this.repetition ++;
            this.timer = this.initialTimer;
            
            if(this.repetitionLimit == 0)
            {   
                this.counterOver = this.callBackFunc();
                if(!this.counterOver)
                {   
                    this.animationContainer =  window.requestAnimationFrame(this.start)
                }
                else
                {  
                    this.cancelCounter()
                }
            }
            else
            {
                this.callBackFunc();
                if(this.repetition<this.repetitionLimit)
                    {
                        this.animationContainer =  window.requestAnimationFrame(this.start)
                    }
                    else
                    {
                        this.cancelCounter();
                        this.callBackFunc2();
                    }
            }
            
           
           
        }
        else
        {
            this.animationContainer =  window.requestAnimationFrame(this.start)
            
        }

        
    }
    cancelCounter()
    {
       
        window.cancelAnimationFrame(this.animationContainer)
    }
}



export function getCookieFunc(name) {
    const cookieName = name + "=";
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1);
        }
        if (cookie.indexOf(cookieName) === 0) {
        return cookie.substring(cookieName.length, cookie.length);
        }
    }
    return 'empty';
  }
  export function setCookieFunc(name, value, expirationDays) {
    const date = new Date();
    date.setTime(date.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  }
  
  export function deleteCookie(_name) {
    document.cookie = _name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
  
  
  
  export function encryptData(_dataToEncrypt)
  {
              const secretKey = "yourSecureKey";
  
              const encryptedSave = cryptoJs.AES.encrypt(_dataToEncrypt, secretKey).toString();
              
              setCookieFunc('DW_SAVE',encryptedSave,5)
  
              
  }
  
  export function decryptData(_encryptedData)
  {
              const secretKey = "yourSecureKey";
  
              const decryptedLevel = cryptoJs.AES.decrypt(_encryptedData, secretKey).toString(cryptoJs.enc.Utf8);
              return decryptedLevel;
  }