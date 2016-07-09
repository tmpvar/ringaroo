var roundedRect = require('./ctx-rounded-rect')
module.exports = arrows

// where r is the distance from the origin (-r, r)
function arrows(ctx, r) {
  ctx.save()
    ctx.translate(-r, 0)
    roundedRect(ctx, 0, 0, 40, 30)
    ctx.strokeStyle = ctx.fillStyle = 'white'
    ctx.stroke()
    ctx.fill()

    ctx.translate(4, 1)

    arrow(ctx)

  ctx.restore()

  ctx.save()
    ctx.translate(r - 40, 0)
    roundedRect(ctx, 0, 0, 40, 30)
    ctx.strokeStyle = ctx.fillStyle = 'white'
    ctx.stroke()
    ctx.fill()

    ctx.translate(4, 1)
    ctx.scale(-1, 1)
    ctx.translate(-32, 0)
    arrow(ctx)

  ctx.restore()
}

function arrow(ctx) {
  ctx.lineWidth = 5
  ctx.beginPath()
    ctx.moveTo(30, 15)
    ctx.lineTo(15, 15)
    ctx.lineTo(15, 10)
    ctx.lineTo(5, 15)
    ctx.lineTo(15, 20)
    ctx.lineTo(15, 15)

  ctx.strokeStyle = ctx.fillStyle = '#223'
  ctx.stroke()
  ctx.fill()
}

