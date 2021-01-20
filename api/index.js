const {noise, noiseDetail, noiseSeed} = require('../noise')
const { createCanvas, loadImage } = require('canvas')
const express = require('express')
const chroma = require('chroma-js')
const app = express()


module.exports = (req, res) => {
  noiseSeed(Math.random() * Math.PI)
  const w = Number(req.query.width) || 200
  const h = Number(req.query.height) || 200
  const noise_dist = Number(req.query.distance) || 100
  noiseDetail(Number(req.query.lod) || 3, Number(req.query.fallof) || .5)

  const colors = req.query.colors ? req.query.colors.split(',') : ['#a50026', '#313695']

  const scale = chroma.scale(colors).mode('lrgb')

  const canvas = createCanvas(w, h)
  const ctx = canvas.getContext('2d')

  const imageData = ctx.getImageData(0, 0, w, h)
  const length = imageData.data.length


  let x = 0
  let y = 0
  for (let i = 0; i < length / 4; i++) {
    const j = i * 4

    if (x === (w - 1)) {
      x = 0
      y++
    } else {
      x++
    }


    const ns = noise(x / noise_dist, y / noise_dist)

    const [r, g, b] = scale(ns).rgb()

    imageData.data[j] = r
    imageData.data[j + 1] = g
    imageData.data[j + 2] = b
    imageData.data[j + 3] = 255
  }

  ctx.putImageData(imageData, 0, 0, 0, 0, w, h)

  res.setHeader('Content-Type', 'image/png')
  canvas.createJPEGStream().pipe(res)

}