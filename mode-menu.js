var circle = require('ctx-circle')

var createRing = require('./ctx-ring')
var colorAtRingIndex = require('./color-at-ring-index')
var roundedRect = require('./ctx-rounded-rect')
var promptPlay = require('./prompt-play')
var arrows = require('./ctx-keyboard-arrows')

function newRandomTarget(current, segments) {
  var next = current
  var sentinel = 10
  while (next === current && sentinel --) {
    next = Math.floor(Math.random() * segments)
    next = (current + next) % segments
  }

  return next
}

module.exports = {
  tick: tick,
  render: render,
  keyboard: keyboard,
  init: init,
}

var state = null
var startingBounceVelocity = 12
var innerRadius = 200
function init() {
  state = {
    gravity: .25,
    innerRadius: innerRadius,
    outerRadius: innerRadius + 50,
    segments: 2,
    userSelection: 0,
    ball: {
      velocity: -1,
      position: 0,
      radius: innerRadius / 10
    },
    target: 0,
    lastTarget: 0,
    bounceVelocity: 12,
    bounces: 0,
    gameOver: false,
    level: 1,
    danger: false,
    score: 0,
    effects: []
  }

  state.ring = createRing(state.target)

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
  promptPlay(ctx)

}

function wrapSelection(selection, segments) {
  if (selection < 0) {
    var mod = (selection % (-segments))
    if (mod === 0) {
      return 0
    }

    return segments + mod
  } else {
    return selection % segments
  }
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
