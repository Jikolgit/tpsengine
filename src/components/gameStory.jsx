const speech_0 = 
[
    <div>
        Vous faites partie des nouvelles recrues des soldats du roi AGADJA
        votre entrainement démarre maintenant dans la fôrêt.
    </div>,
    <div>
        Récupérez votre lance et avancez !
    </div>
]
const speech_1 = 
[
    <div>
        Détruisez les barils pour avancer.
    </div>,

]
const speech_3 = 
[
    <div>
        Continuez de détruire les <span className="text-red-500">barils</span> pour avancer.
    </div>,
    <div>
    Récuperez les <span className="text-yellow-500">cauris</span> pour avancer.
    </div>

]
const speech_5 = 
[
    <div>
        Evitez les <span className="text-red-500">projectiles</span> et Détruisez les <span className="text-red-500">barils</span> pour avancer.
    </div>,


]
const speech_7 = 
[
    <div>
        Recuperez la <span className="text-green-500">gourde</span> pour vous soigner.
    </div>,


]
const speech_9 = 
[
    <div>
        Un broullard s'install sur la forêt
    </div>,
    <div>
    Des <span className="text-red-500">fétiches</span> apparaissent à la place des barils. <br />Soiyez prudent!
    </div>


]
// const speech_10 = 
// [
//     <div>
//         La nuit tombe
//     </div>,
//     <div>
//     Les <span className="text-red-500">fétiches</span> deviennent nombreux <br />
//     </div>,
//     <div>
//     Retournez vite au <span className="text-yellow-500">village !</span>
//     </div>


// ]
let storyText = {value:['none']} ;
let speechTimeline=[];
for(let i =0;i<14;i++)
{
    speechTimeline[i] = ['none'];
}
speechTimeline[0] =speech_0
speechTimeline[1] =speech_1
speechTimeline[3] =speech_3
speechTimeline[5] =speech_5
speechTimeline[7] =speech_7
speechTimeline[9] =speech_9
export {speechTimeline,storyText}