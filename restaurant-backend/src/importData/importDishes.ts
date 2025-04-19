import mongoose from 'mongoose'
import * as XLSX from 'xlsx'
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const run = async () => {
  if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI environment variable is not defined.')
    process.exit(1)
  }

  await mongoose.connect(process.env.MONGO_URI)
  console.log('✅ Connected to MongoDB')

  interface IDish {
    name: string
    shortDescription: string
    description: string
    ingredients: string
    price: number
    images: string[]
    slug: string
  }

  const dishSchema = new mongoose.Schema<IDish>({
    name: String,
    shortDescription: String,
    description: String,
    ingredients: String,
    price: Number,
    images: [String],
    slug: String
  })

  const Dish = mongoose.model<IDish>('Dish', dishSchema)

  const uploadImage = async (filePath: string): Promise<string> => {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'dishes'
      })
      return result.secure_url
    } catch (err) {
      console.error(`❌ Error uploading ${filePath}:`, err)
      throw err
    }
  }

  const convertToSlug = (name: string): string => {
    if (!name) return ''
    return name.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'D')
      .replace(/\s+/g, '_')
  }

  const workbook = XLSX.readFile(path.join(__dirname, 'dishes.xlsx'))
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const data = XLSX.utils.sheet_to_json<any>(sheet)

  for (const item of data) {
    const name = item['Tên món']
    const shortDescription = item['Mô tả ngắn'] || ''
    const description = item['Mô tả'] || ''
    const ingredients = item['Nguyên liệu'] || ''
    const price = Number(item['Giá (VND)']) || 0

    const slug = convertToSlug(name)
    const baseImageName = slug

    const imageExtensions = ['.jpg', '.jpeg', '.png']

    const imagePaths = [
      ...imageExtensions.map(ext => path.join(__dirname, 'menu_images', `${baseImageName}${ext}`)),
      ...imageExtensions.map(ext => path.join(__dirname, 'menu_images', `${baseImageName}_1${ext}`))
    ]
    const uploadedImages: string[] = []

    for (const imgPath of imagePaths) {
      if (fs.existsSync(imgPath)) {
        try {
          const url = await uploadImage(imgPath)
          uploadedImages.push(url)
        } catch {
          console.warn(`⚠️ Failed to upload image: ${imgPath}`)
        }
      } else {
        console.warn(`⚠️ Missing image: ${imgPath}`)
      }
    }

    if (uploadedImages.length > 0) {
      try {
        const dish = new Dish({
          name,
          shortDescription,
          description,
          ingredients,
          price,
          slug,
          images: uploadedImages
        })

        await dish.save()
        console.log(`✅ Saved: ${name}`)
      } catch (err) {
        console.error(`❌ Failed to save dish "${name}":`, err)
      }
    } else {
      console.warn(`⚠️ No images uploaded for dish "${name}". Skipping creation.`)
    }
  }

  console.log('🥳 Import hoàn tất!')
  process.exit()
}

run().catch(err => {
  console.error('❌ Error running the import process:', err)
  process.exit(1)
})
