var roundedRect = require('./ctx-rounded-rect')

module.exports = renderPrompt

function renderPrompt(ctx) {
  ctx.fillStyle = 'white'
  ctx.font = '40px amboy-black'
  ctx.fillText('PRESS', -80, 0)
  ctx.fillText('TO PLAY!', -80, 40)

  // render return key
  ctx.save()
    ctx.translate(38, -33)
    ctx.strokeStyle = 'white'
    roundedRect(ctx, 0, 0, 45, 33, 6)
    ctx.fill()

    ctx.translate(5, 5)
    ctx.lineWidth = 5
    ctx.beginPath()
      ctx.moveTo(30, 0)
      ctx.lineTo(30, 15)
      ctx.lineTo(15, 15)
      ctx.lineTo(15, 10)
      ctx.lineTo(5, 15)
      ctx.lineTo(15, 20)
      ctx.lineTo(15, 15)
      ctx.lineTo(30, 15)
      ctx.lineTo(30, 0)

    ctx.fillStyle = ctx.strokeStyle = "#223"
    ctx.stroke()
    ctx.fill()
  ctx.restore()
}
