var circle = require('ctx-circle')
var createRing = require('./ctx-ring')

module.exports = {
  tick: tick,
  render: render,
  init: init,
}

var state = null
var startingBounceVelocity = 12
function init(segments, innerRadius) {
  state = {
    // loading specific
    start: Date.now(),
    rotation: 0
  }

  var minimumTime = 10

  state.ring = createRing(state.target)

  // load up fonts
  var el = document.createElement('script');
  el.src = 'https://use.typekit.net/yew1uke.js';
  el.onload = function() {
    Typekit.load({
      async: true,
      active: function() {
        state.removeLoadingScreen = Date.now() + 500
        delete window.Typekit
      }
    });
  };

  document.body.appendChild(el);
  return state
}

function tick(changeMode) {
  if (state.removeLoadingScreen < Date.now()) {
    changeMode('fail')
  }
}

function render(ctx) {
  state.rotation += Math.PI/100

  ctx.save()
    ctx.rotate(state.rotation)
    state.ring(ctx, 10, 25, 30)
  ctx.restore()
}
