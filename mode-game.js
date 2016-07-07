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

  return next
}

module.exports = {
  tick: tick,
  render: render,
  keyboard: keyboard,
  init: init,
  audioOn: audioOn
}

var state = null
var startingBounceVelocity = 12
function init(segments, innerRadius) {
  state = {
    gravity: .25,
    innerRadius: innerRadius,
    outerRadius: innerRadius + 50,
    segments: segments,
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

function createBounceEffect(startRadius, endRadius, ms, color, width) {
  var start = Date.now()
  ms = ms || 100
  color = color || 'white'
  width = width || 1

  return function (ctx) {
    var now = Date.now()

    var t = (now - start)/ms
    var lerped = (endRadius - startRadius) * t
    ctx.save()
      ctx.globalAlpha = Math.max(0, 1 - t)
      ctx.strokeStyle = color
      ctx.lineWidth = width
      ctx.beginPath()
        circle(ctx, 0, 0, startRadius + lerped)
        ctx.stroke()
    ctx.restore()
    return t >= 1
  }
}

function tick() {
  if (state.ball.position + state.ball.radius > state.innerRadius) {
    // success!
    if (state.target === state.userSelection) {
      state.bounceVelocity -= .1
      state.bounces += 1

      var levelBounces = state.level > 1 ? Math.pow((state.level - 1)*2, 2) : state.bounces
      var targetBounces = Math.pow(state.segments, 2)

      note(82.41 , .05).then(note.bind(0, 164.81 + (levelBounces / targetBounces) * 1000, .2))

      var placesMoved = Math.abs(Math.min(state.lastTarget - state.target, state.target - state.target)) || 1

      state.score += placesMoved * ((state.danger) ? 250 : 1000)

      state.danger = false

      if (state.bounces > targetBounces) {
        state.score += state.segments * 1000

        note(300, .25)
          .then(note.bind(0, 400, .25))
          .then(note.bind(0, 500, .25))

        for (var i=0; i<state.segments; i++) {
          for (var j=0; j<3; j++) {
            state.effects.push(createBounceEffect(
              state.outerRadius,
              state.outerRadius + (500 * Math.random())|0,
              (1200 * Math.random())|0,
              colorAtRingIndex(i, state.segments),
              (Math.random() * 10)|0
            ))
          }
        }

        state.segments += 2
        state.userSelection = 0
        state.ring.reset()
        state.bounceVelocity = startingBounceVelocity

      } else {
        state.effects.push(createBounceEffect(
          state.outerRadius,
          state.outerRadius + 100,
          1000,
          colorAtRingIndex(state.target, state.segments),
          1
        ))

        state.effects.push(createBounceEffect(
          state.outerRadius,
          state.outerRadius + 200,
          500,
          colorAtRingIndex(state.target, state.segments),
          3
        ))

        state.effects.push(createBounceEffect(
          state.outerRadius,
          state.outerRadius + 200,
          250,
          colorAtRingIndex(state.target, state.segments),
          2
        ))

        state.effects.push(createBounceEffect(
          state.outerRadius,
          state.outerRadius + 200,
          150,
          colorAtRingIndex(state.target, state.segments)
        ))

        state.lastTarget = state.target
        state.target = newRandomTarget(state.target, state.segments)
      }
      state.ball.velocity = state.bounceVelocity
      console.log(state.score)
    // game over!
    } else {
      state.ball.position = state.innerRadius - state.ball.radius + 1
      if (!state.danger) {
        state.ball.velocity = state.bounceVelocity / 2
        state.danger = true
        // TODO: screen shake!
        // note(201, .25)
        note(82.41 , .05)
        // note(121, .25)

      } else {
        if (!state.gameOver) {
          state.gameOver = true

          var sequence = note(1000, .05)
          for (var i=0; i<20; i++) {
            sequence = sequence.then(note.bind(0, 1000 - i*50, .045))
          }

          sequence = sequence.then(function() {
            note(200, .75)
            note(201, .75)
            note(101, 1)
          })
        }

        // state.ring.next()
        state.innerRadius-=3
        state.ball.position += 3
        state.ball.radius-=.1

        if (state.innerRadius < 0) {

        }
        return
      }
    }
  }

  state.ball.velocity -= .2
  state.ball.position -= state.ball.velocity
}

function render(ctx) {
  if (state.innerRadius > 0) {
    state.ring(ctx, state.segments, state.innerRadius, state.outerRadius)

    ctx.beginPath()
      circle(ctx, 0, state.ball.position, state.ball.radius)
      ctx.fillStyle = colorAtRingIndex(state.target, state.segments)
      ctx.fill()

    ctx.fillStyle = 'white'
    ctx.save()
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.font = '40px monospace'
      ctx.fillText(state.score, 40, 40)
    ctx.restore()
  }

  var effects = state.effects
  var l = effects.length
  if (l) {
    for (var i = l-1; i >= 0; i--) {
      // effects are done when they return true
      if (effects[i](ctx) === true) {
        effects.splice(i, 1)
      }
    }
  }
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

function audioOn(audioCtx) {
  state.audio = {
    ctx: audioCtx,
    dest: audioCtx.createAnalyser()
  }

  state.audio.dest.connect(state.audio.ctx.destination)
}

function audioOff() {
  state.audio.dest.disconnect(state.audio.ctx.destination)
}

function note(freq, length) {
  return new Promise(function(resolve) {
    freq = freq|0
    length = length || 0.2
    var audio = state.audio


    var oscillator = audio.ctx.createOscillator()
    var gain = audio.ctx.createGain()
    gain.gain.value = .5
    gain.connect(audio.dest)

    oscillator.onended = function() {
      this.disconnect(gain)
      resolve(true)
    }

    var now = audio.ctx.currentTime

    oscillator.type = 'sine';
    oscillator.frequency.value = freq; // value in hertz
    oscillator.connect(gain);
    oscillator.start(0);

    setTimeout(function() {
      gain.gain.value = 0
      setTimeout(function() {
        oscillator.stop(now)
      }, 10)

    }, length * 1000)
  })
}
