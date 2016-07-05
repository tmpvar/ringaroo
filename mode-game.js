var circle = require('ctx-circle')

var createRing = require('./ctx-ring')
var colorAtRingIndex = require('./color-at-ring-index')

function newRandomTarget(current, segments) {
  var next = current
  var sentinel = 10
  while (next === current && sentinel --) {
    next = Math.floor(Math.random() * segments)
    next = (current + next) % segments
  }
console.log(current, next)
  return next
}

module.exports = {
  tick: tick,
  render: render,
  keyboard: keyboard,
  init: init
}

var state = null

function init(segments, innerRadius) {
  state = {
    gravity: .25,
    innerRadius: innerRadius,
    segments: segments,
    userSelection: 0,
    ball: {
      velocity: -1,
      position: 0,
      radius: innerRadius / 10
    },
    target: 0,
    bounceVelocity: 12,
    bounces: 0
  }

  state.ring = createRing(state.target)

  return state
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

function tick() {
  if (state.ball.position + state.ball.radius > state.innerRadius) {
    // success!
    if (state.target === state.userSelection) {
      state.bounceVelocity -= .1
      state.bounces += 1

      if (state.bounces > Math.pow(state.segments, 2)) {
        console.log('GREAT JOB!')
        state.segments += 2
        state.userSelection = 0
        state.ring.reset()
        state.bounceVelocity = 12
      } else {
        state.target = newRandomTarget(state.target, state.segments)
      }
      state.ball.velocity = state.bounceVelocity

    // game over!
    } else {
      console.log('game over')
      return
    }
  }

  state.ball.velocity -= .2
  state.ball.position -= state.ball.velocity
}

function render(ctx) {
  state.ring(ctx, state.segments, state.innerRadius)

  ctx.beginPath()
    circle(ctx, 0, state.ball.position, state.ball.radius)
    ctx.fillStyle = colorAtRingIndex(state.target, state.segments)
    ctx.fill()
}

function keyboard(e) {
  if (e.keyCode === 39) {
    state.previousSelection = state.userSelection
    state.userSelection = wrapSelection(state.userSelection + 1, state.segments)
    state.ring.prev()
  }

  if (e.keyCode === 37) {
    state.previousSelection = state.userSelection
    state.userSelection = wrapSelection(state.userSelection - 1, state.segments)
    state.ring.next()
  }
}
