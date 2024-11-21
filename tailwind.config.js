/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js,jsx}","./components/**/*.{html,js,jsx}"],
    theme: {
      screens:{
        'md1':{'max':'500px'}
      },
      fontFamily:{
        'gun': ['gunplay']
      },
      extend: 
      {
        animation:
        {
          'screen-glowRed': 'screenGlowRed 0.5s',
          'screen-glowGreen': 'screenGlowGreen 0.5s'
        },
        keyframes:
        {
          screenGlowRed:
          {
            '0%':{boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.3)'},
            '50%':{boxShadow:'inset 0 0 30px 40px rgba(255,0,0,0.3)' },
            '100%':{boxShadow:'inset 0 0 0 1px rgba(0,0,0,0.3)' },
          },
          screenGlowGreen:
          {
            '0%':{boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.3)'},
            '50%':{boxShadow:'inset 0 0 30px 40px rgba(0,255,0,0.3)' },
            '100%':{boxShadow:'inset 0 0 0 1px rgba(0,0,0,0.3)' },
          }
        }
      },
    },
    plugins: [],
  }