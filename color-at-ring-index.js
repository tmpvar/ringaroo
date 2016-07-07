module.exports = colorAtRingIndex

function colorAtRingIndex(index, segments) {
  var rot = (40 + index/segments * 360) % 360
  return 'hsl(' + rot + ', 100%, 60%)'
}
