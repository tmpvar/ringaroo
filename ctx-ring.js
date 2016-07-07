var colorAtRingIndex = require('./color-at-ring-index')

module.exports = createRing

var TAU = Math.PI*2
var oneDegree = TAU/360

function createRing(startingIndex) {

  var lastTargetIndex = startingIndex || 0
  var inter = 0
  var rotation = 0
  var animating = false
  var direction = 1
  var targetIndex = lastTargetIndex
  drawRing.next = function next() {
    targetIndex++
  }

  drawRing.prev = function prev() {
    targetIndex--
  }

  drawRing.reset = function reset() {
    targetIndex = 0
  }


  return drawRing

  function drawRing(ctx, segments, radius, outerRadius) {
    var segmentSpan = TAU/segments
    var halfSpan = segmentSpan/2

    if (lastTargetIndex !== targetIndex) {
      animating = targetIndex * segmentSpan
    }

    if (animating !== false) {
      var d = animating - rotation
      rotation += d / 2

      if (Math.abs(d) < 1e-5) {
        animating = false
        inter = 0
        lastTargetIndex = targetIndex
        rotation = targetIndex * segmentSpan
      }
    }

    ctx.save()
      ctx.rotate(Math.PI/2 - halfSpan + rotation)
      for (var i=0; i<segments; i++) {
        ctx.beginPath()
          ctx.arc(0, 0, radius, 0, segmentSpan)
          ctx.save()
            ctx.rotate(segmentSpan)
            ctx.lineTo(outerRadius, 0)
          ctx.restore()

          ctx.arc(0, 0, outerRadius, segmentSpan, 0, true)
          ctx.lineTo(radius, 0)
        ctx.closePath()

        ctx.fillStyle = colorAtRingIndex(i, segments)
        ctx.fill()
        ctx.rotate(segmentSpan)
      }

      ctx.save()

        ctx.strokeStyle = '#223'
        ctx.lineWidth = 5

        for (var i=0; i<segments; i++) {
          ctx.beginPath()
            ctx.moveTo(0, 0)
            ctx.lineTo(outerRadius+10, 0)
            ctx.stroke()
          ctx.rotate(segmentSpan)
        }
      ctx.restore()
    ctx.restore()
  }
}
