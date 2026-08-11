import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve('public/images')

const PRESETS = {
  hero: { width: 900, quality: 78 },
  card: { width: 900, quality: 78 },
  gallery: { width: 1100, quality: 72 },
  stickers: { width: 320, quality: 70 },
}

async function optimizeFile(filePath, preset) {
  const input = await fs.promises.readFile(filePath)
  const before = input.length
  const out = await sharp(input, { failOn: 'none' })
    .rotate()
    .resize({
      width: preset.width,
      height: preset.width,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality: preset.quality, mozjpeg: true })
    .toBuffer()

  // Always write as .jpg if source was jpeg-ish; keep same path extension if .jpg
  const ext = path.extname(filePath).toLowerCase()
  let target = filePath
  if (ext === '.jpeg' || ext === '.png' || ext === '.webp') {
    target = filePath.replace(/\.(jpeg|png|webp)$/i, '.jpg')
  }

  // Skip write if not meaningfully smaller
  if (out.length >= before * 0.95 && target === filePath) {
    return { before, after: before, skipped: true }
  }

  await fs.promises.writeFile(target, out)
  if (target !== filePath) {
    await fs.promises.unlink(filePath)
  }
  return { before, after: out.length, skipped: false, target }
}

async function main() {
  let totalBefore = 0
  let totalAfter = 0

  for (const [folder, preset] of Object.entries(PRESETS)) {
    const dir = path.join(root, folder)
    if (!fs.existsSync(dir)) continue
    const files = fs
      .readdirSync(dir)
      .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
      .sort()

    for (const file of files) {
      const full = path.join(dir, file)
      const result = await optimizeFile(full, preset)
      totalBefore += result.before
      totalAfter += result.after
      const kb = (n) => `${Math.round(n / 1024)}KB`
      console.log(
        `${folder}/${file}: ${kb(result.before)} → ${kb(result.after)}${result.skipped ? ' (skip)' : ''}`,
      )
    }
  }

  console.log(
    `\nTotal: ${(totalBefore / 1024 / 1024).toFixed(2)}MB → ${(totalAfter / 1024 / 1024).toFixed(2)}MB`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
