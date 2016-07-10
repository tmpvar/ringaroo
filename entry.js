var fc = require('fc')
var center = require('ctx-translate-center')
var modes = {
  loading: require('./mode-loading'),
  menu: require('./mode-menu'),
  game: require('./mode-game'),
  fail: require('./mode-fail')
}

var mode
window.AudioContext = window.AudioContext||window.webkitAudioContext;
var audioCtx = new AudioContext()

var locked = true;
audioCtx.unlock = function() {

  if(!locked)
    return console.log('')

  // create empty buffer and play it
  var buffer = audioCtx.createBuffer(1, 1, 22050);
  var source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(audioCtx.destination);
  source.noteOn(0);

  // by checking the play state after some time, we know if we're really unlocked
  setTimeout(function() {
    if((source.playbackState === source.PLAYING_STATE || source.playbackState === source.FINISHED_STATE)) {
      locked = false;
    }
  }, 0);
}


function changeMode(target, state) {
  if (mode) {
    mode.audioOff && mode.audioOff(audioCtx)
  }

  mode = modes[target]
  mode.init && mode.init(state)
  mode.audioOn && mode.audioOn(audioCtx)
}

changeMode('loading')
var mouse = { down: false, pos: [0, 0], last: 0}
var repeatTime = 200

rot = 0
var ctx = fc(function() {

  rot = (rot + 1) % 360
  ctx.clear()
  center(ctx)
  mode.tick && mode.tick(changeMode)
  mode.render(ctx)
  var now = Date.now()

  if (mouse.down && mouse.last < now - repeatTime) {
    mouse.last = now
    var cx = ctx.canvas.width / 2
    var cy = ctx.canvas.height / 2

    var dx = cx - mouse.pos[0]
    var dy = cy - mouse.pos[1]

    // central click
    if (mode !== modes.game && Math.sqrt(dx*dx + dy*dy) <= 200) {
      audioCtx.unlock()
      mode.keyboard && mode.keyboard({ keyCode: 13 })
    } else if (mouse.pos[0] < cx) {
      mode.keyboard && mode.keyboard({ keyCode: 39 })
    } else if (mouse.pos[0] >= cx) {
      mode.keyboard && mode.keyboard({ keyCode: 37 })
    }
  }
}, true)

window.addEventListener('keydown', function(e) {
  mode.keyboard && mode.keyboard(e)
})

window.addEventListener('touchend', function(e) {
  mouse.down = false
})

window.addEventListener('touchstart', function(e) {
  mouse.down = true
  mouse.pos[0] = e.targetTouches.item(0).clientX
  mouse.pos[1] = e.targetTouches.item(0).clientY
  mouse.last = 0
  audioCtx.unlock()
})
