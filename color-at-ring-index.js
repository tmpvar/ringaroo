module.exports = colorAtRingIndex

function colorAtRingIndex(index, segments) {
  return 'hsl(' + (index/segments * 360) + ', 100%, 60%)'
}
