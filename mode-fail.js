var circle = require('ctx-circle')

var createRing = require('./ctx-ring')
var roundedRect = require('./ctx-rounded-rect')
var menu = require('./mode-menu')
var promptPlay = require('./prompt-play')
var arrows = require('./ctx-keyboard-arrows')

module.exports = {
  tick: tick,
  render: render,
  keyboard: keyboard,
  init: init
}

var state = null
var startingBounceVelocity = 12
var innerRadius = 200
function init(nextState) {
  menu.init()
  state = Object.assign({
    innerRadius: innerRadius,
    outerRadius: innerRadius + 50,
    ring: createRing(0, function (index, segments) {
      var sat = Math.min((64 + index/segments * 128), 255).toString(16)
      return '#' + sat + sat + sat
    })
  }, nextState)
  return state
}

function tick(changeMode) {
  if (state.beginPlay) {
    changeMode('game')
  }
}

function render(ctx) {
  ctx.save()
    ctx.translate(0, state.outerRadius)
    arrows(ctx, state.outerRadius/2 + 15)
  ctx.restore()

  state.ring(ctx, 8, state.innerRadius, state.outerRadius)

  ctx.save()
    ctx.translate(0, 10)
    ctx.fillStyle = 'red'
    ctx.font = '40px amboy-black'
    ctx.fillText('GAME OVER', -100, -40)
    ctx.translate(0, 20)
    promptPlay(ctx)

  ctx.restore()
}

function keyboard(e) {
  if (e.keyCode === 13) {
    state.beginPlay = true
    // TODO: play a sound
  }

  if (e.keyCode === 39) {
    state.ring.prev()
  }

  if (e.keyCode === 37) {
    state.ring.next()
  }
}
