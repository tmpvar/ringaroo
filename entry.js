var fc = require('fc')
var center = require('ctx-translate-center')
var modes = {
  loading: require('./mode-loading'),
  game: require('./mode-game')
}

var mode
window.AudioContext = window.AudioContext||window.webkitAudioContext;
var audioCtx = new AudioContext()

function changeMode(target) {
  if (mode) {
    mode.audioOff && mode.audioOff(audioCtx)
  }

  mode = modes[target]
  mode.init && mode.init()
  mode.audioOn && mode.audioOn(audioCtx)
}

changeMode('loading')

rot = 0
var ctx = fc(function() {

  rot = (rot + 1) % 360
  ctx.clear()
  center(ctx)
  mode.tick && mode.tick(changeMode)
  mode.render(ctx)
}, true)


window.addEventListener('keydown', function(e) {
  mode.keyboard && mode.keyboard(e)
})
