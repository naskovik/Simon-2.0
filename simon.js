const colors = ['red','yellow','green','blue'];
var playersKeys = [];

const SVGArc = function() {
  let d, color, grey
  return {
    oninit: (vnode) => {
      d = vnode.attrs.d;
      color = vnode.attrs.color;
      //setTimeout(() => { grey = true; m.redraw(); }, 1000);
    },
    view: () => {
      return [
        m('path',
          { d:d, style: { fill: color, stroke: 'black', 'stroke-width': '12', cursor: 'pointer' }, 
            onclick: (e) => {
              // e.target.style.fill = color;
              // setTimeout(() => e.target.style.fill = colors[4], 300);
              playersKeys.push(color);
            }
          }
        )
      ]
    },
  }
}

const SimonsOrder = function() {
  let currentColors;
  let showOrder;
  let difficulty;
  let turn;
  function calculateColors() {
    showOrder = true;
    setTimeout(() => { showOrder = false; m.redraw(); }, 500 * difficulty)
    return [...Array(difficulty).keys()].map(() => colors[Math.floor(Math.random() * 4)]);
  }

  function compareColors(arr1, arr2) {
    return arr1.slice(-difficulty).toString() === arr2.slice(-difficulty).toString();
  }

  function oneMoreTurn() {
    turn++;
    if(turn > 5) {
      difficulty++;
      turn = 0;
    }
    currentColors = calculateColors();
  }

  return {
    oninit: () => {
      difficulty = 1;
      turn = 1;
      currentColors = calculateColors();
      showOrder = true;
    },
    view: () => {
      compareColors(playersKeys, currentColors) ? oneMoreTurn() : null;
      return [
        m('.ui.container', { style: { 'margin-top': '19px' } }, [
          m('.ui.circular.green.icon.big.button', {
            style: { 'font-size': '27' },
            onclick: () => { 
              difficulty < 4 ? difficulty++ : null;
              currentColors = calculateColors();
            }
          }, '+'),
          m('.ui.circular.icon.red.big.button', {
            style: { 'font-size': '27' },
            onclick: () => { 
              difficulty > 1 ? difficulty-- : null; 
              currentColors = calculateColors(); 
            }
          }, '-')
        ], `DIFICULTAD:  ${difficulty}`),
        m('.ui.segment.green', { style: { 'text-align': 'center' } }, [
          showOrder ? m('label', { style: { marginLeft: '20px', fontSize: '25px' } }, [
              [...Array(difficulty).keys()].map((elem) => m(`.ui.big.button.${currentColors[elem]}`, { style: { cursor: 'default' } })) 
            ]) : null
          ]),
      ]
    },
  }
}



const SimonBoard = function() {
  let playing;
 return {
   oninit: (vnode) => {
    playing = vnode.attrs
   },
  view: () => {
    return [
       m('svg', { width: '800px', height: '600px', viewBox: '0, 0, 800, 800', baseProfile: 'full' }, [
         // ?BOTONES
        m(SVGArc, { d: 'M 400 400 H 100 A 300 300 300 0 1 400 100 V 400', color: colors[0] }),
        m(SVGArc, { d: 'M 400 400 H 700 A 300 300 300 0 0 400 100 V 400', color: colors[1] }),
        m(SVGArc, { d: 'M 400 400 H 100 A 300 300 300 0 0 400 700 V 400', color: colors[2] }),
        m(SVGArc, { d: 'M 400 400 H 700 A 300 300 300 0 1 400 700 V 400', color: colors[3] }),
         // Circulo interior
         m('circle', 
          { cx: '400', cy: '400',r: '40',stroke: 'black', 'stroke-width': "17", fill: 'black'},
        )
      ]),
    ]
  },
 }
}

const Simon = function(){
  let playing;
  return {
    oninit: () => { 
      playing = false;
    },
    view: () => {
      return [
        m('.ui.large.header',{ style: { marginTop: '10px', textAlign: 'center'} },  'Simon Says'),
        
        m('.ui.container', { style: { 'text-align': 'center' } }  ,[
          m('.ui..huge.button.inverted.green', { 
            style: { 'background-color': 'black' },
            onclick: () => {
              playing = !playing;
              playersKeys = [];
            } 
          } ,playing ? 'Reiniciar' : 'Jugar'),
        ]),
        m('.ui.divider'),
        playing ? [ 
          m(SimonsOrder),
          m(SimonBoard, { playing: playing }), 
        ] : null
      ]
    },
  }
}



m.mount(document.body, Simon);
