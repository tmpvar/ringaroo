module.exports = score

function score(ctx, value) {
  value = String(value)
  var l = value.length
  var str = ''
  for (var i=l-1,c = 0; i>=0; i--, c++) {
    if (c%3 === 0 && c) {
      str = ',' + str
    }
    str = value[i] + str
  }

  ctx.fillStyle = 'white'
  ctx.font = '40px amboy-black'

  var w = ctx.measureText(str).width|0
  ctx.save()
    ctx.translate(-w/2, -ctx.canvas.height/2)
    ctx.fillText(str, 0, 50)
  ctx.restore()
}
