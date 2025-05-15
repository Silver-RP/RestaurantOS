import mongoose from 'mongoose';
import * as XLSX from 'xlsx';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();
console.log('MONGO_URI:', process.env.MONGO_URI);

/*
  4 điểm cần chú ý:
  - Thay đổi Category ID
  - Thay đổi đường dẫn ảnh
  - Thay đổi tên file excel
  - Thay đổi tên folder trên Cloudinary

*/

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const run = async () => {
  if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI environment variable is not defined.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  interface IDish {
    name: string;
    shortDescription: string;
    description: string;
    ingredients: string;
    price: number;
    discount_price?: number | null;
    slug: string;
    images: string[];
    status: 'available' | 'hidden' | 'soldout';
    views: number;
    ordered_count: number;
    average_rating: number;
    rating_count: number;
    favorites_count: number;
    rating: number;
    categories: mongoose.Types.ObjectId[];
    countInStock: number;
    isDishNew?: boolean;
    newUntil?: Date;
    totalSoldQuantity?: number;
    discountUntil?: Date;
    recommend?: boolean;
    alcohol_type?: string;
    origin?: string;
    alcohol_content?: number;
    volume?: number;
  }

  const dishSchema = new mongoose.Schema<IDish>(
    {
      name: String,
      shortDescription: String,
      description: String,
      ingredients: String,
      price: Number,
      discount_price: Number,
      slug: String,
      images: [String],
      status: {
        type: String,
        enum: ['hidden', 'available', 'soldout'],
        default: 'available',
      },
      views: Number,
      ordered_count: Number,
      average_rating: Number,
      rating_count: Number,
      favorites_count: Number,
      rating: Number,
      categories: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'categories',
          required: true,
        },
      ],
      countInStock: Number,
      isDishNew: { type: Boolean, default: false },
      newUntil: Date,
      totalSoldQuantity: Number,
      discountUntil: Date,
      recommend: Boolean,
      alcohol_type: String,
      origin: String,
      alcohol_content: Number,
      volume: Number,
    },
    {
      timestamps: true,
    },
  );
  const Dish = mongoose.model<IDish>('Dish', dishSchema);

  // const importedSlugs = [
  //   "Chateau_Lafite_Rothschild",
  //   "Dominus_Estate",
  //   "Barossa_Valley_Shiraz",
  //   "Domaine_de_la_Romanee_Conti",
  //   "Joseph_Phelps_Insignia",
  //   "Cristal_by_Louis_Roederer",
  //   "Veuve_Clicquot_La_Grande_Dame",
  //   "Armand_de_Brignac_Ace_of_Spades",
  //   "Hennessy_Richard",
  //   "Louis_Moinet",
  //   "Remy_Martin_Louis_XIII",
  //   "The_Macallan_1926_Fine_&_Rare",
  //   "Yamazaki_18_Year_Old",
  //   "The_Botanist",
  //   "Tanqueray_No_10",
  //   "Monkey_47",
  //   "Belvedere_Vodka",
  //   "Grey_Goose",
  //   "Chopin_Vodka",
  //   "Tabali_Pisco",
  //   "Capel_Pisco",
  //   "Pisco_El_Gobernador",
  //   "Martell_Cordon_Bleu",
  //   "Hennessy_Paradis",
  //   "Courvoisier_XO",
  //   "Ron_Diplomatico_Reserva_Exclusiva",
  //   "Mount_Gay_XO",
  //   "Appleton_Estate_21_Year_Old",
  //   "Havana_Club_7_Year_Old",
  //   "Bacardi_Reserva_Limitada"
  // ];
  

  // const cateIdDelete = new mongoose.Types.ObjectId('6803416bdf9079c175db7957');
  // await Dish.deleteMany({ categories: cateIdDelete });
  // await Dish.deleteMany({ slug: { $in: importedSlugs } });
  // await deleteAllCloudinaryImagesInFolder('dishes/alcoholic')
  // await cloudinary.api.delete_resources_by_prefix('dishes/alcoholic');
  // await Promise.all(importedSlugs.map(async (slug) => {
  //   const publicIds = [
  //     `dishes/alcoholic/${slug}`,
  //     `dishes/alcoholic/${slug}_1`,
  //     `dishes/alcoholic/${slug}_2`,
  //     `dishes/alcoholic/${slug}_3`,
  //   ];
  
  //   try {
  //     await cloudinary.api.delete_resources(publicIds);
  //     console.log(`🧹 Deleted images for ${slug}`);
  //   } catch (err) {
  //     console.error(`❌ Failed to delete images for ${slug}:`, err);
  //   }
  // }));
  
  // console.log('🧼 Cleaned up existing data and images!');

  const getRandomFromArray = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
  const getRandomInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;
  const cateId = new mongoose.Types.ObjectId('6803416bdf9079c175db7957');

  const uploadImage = async (filePath: string): Promise<string> => {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'dishes/alcoholic',
      });
      return result.secure_url;
    } catch (err) {
      console.error(`❌ Error uploading ${filePath}:`, err);
      throw err;
    }
  };

  const convertToSlug = (name: string): string => {
    if (!name) return '';
    return name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .replace(/\s+/g, '_');
  };

  // const workbook = XLSX.readFile(path.join(__dirname, 'Alcohon-BeefBeef.xlsx'));
  // const sheet = workbook.Sheets[workbook.SheetNames[0]];
  // const data = XLSX.utils.sheet_to_json<any>(sheet);

  const data =[
    {
      'Tên món': 'Veuve Clicquot La Grande Dame',
      'Mô tả ngắn': 'Champagne cao cấp với lịch sử lâu dài, tượng trưng cho sự sang trọng.',
      'Mô tả': 'Veuve Clicquot La Grande Dame là một loại champagne tinh tế, cao cấp với lịch sử lâu dài. Được làm từ các nho Pinot Noir và Chardonnay, vang này có hương vị phức tạp, mềm mượt và là biểu tượng của sự sang trọng.',
      'Nguyên liệu': 'Nho (Pinot Noir, Chardonnay)',
      'Giá (VND)': '6000000',
      'Loại rượu': 'Champagne',
      'Xuất xứ': 'Pháp',
      'Nồng độ cồn': '12',
      'Thể tích': '750',
    }
  ]

  for (const item of data) {
    const name = item['Tên món'];
    const shortDescription = item['Mô tả ngắn'] || '';
    const description = item['Mô tả'] || '';
    const ingredients = item['Nguyên liệu'] || '';
    const price = Number(item['Giá (VND)']) || 0;
    const alcohol_type = item['Loại rượu'] || '';
    const origin = item['Xuất xứ'] || '';
    const alcohol_content = Number(item['Nồng độ cồn']) || 0;
    const volume = Number(item['Thể tích']) || 0;
    const slug = convertToSlug(name);

    const discountChance = Math.random();
    // const discount_price =
    //   discountChance > 0.5 ? Math.floor(price * (1 - getRandomInt(5, 30) / 100)) : null;

    const getRandomDiscount = (min: number, max: number): number => {
      const discountPercentage = getRandomInt(min, max);
      const discount = price * (discountPercentage / 100);

      const roundedDiscount = Math.floor(discount / 1000) * 1000;
      return roundedDiscount;
    };

    const discount_price = discountChance > 0.5 ? getRandomDiscount(15, 40) : null;

    const statusPool = ['available', 'available', 'available', 'hidden', 'soldout'];
    const status = getRandomFromArray(statusPool);

    const views = getRandomInt(20, 450);
    const ordered_count = getRandomInt(0, 55);
    const rating_count = getRandomInt(0, 200);
    let rating = 0;
    let average_rating = 0;
    if (rating_count > 0) {
      rating = Array.from({ length: rating_count }, () => getRandomInt(3, 5)).reduce(
        (a, b) => a + b,
        0,
      );
      average_rating = parseFloat((rating / rating_count).toFixed(1));
    }
    const recommend = false;
    const favorites_count = getRandomInt(0, 100);
    const countInStock = getRandomInt(0, 30);
    const totalSoldQuantity = getRandomInt(0, 100);

    const imageExtensions = ['.jpg', '.jpeg', '.png'];
    const baseImageName = slug;
    const imagePaths = [
      ...imageExtensions.map((ext) =>
        path.join(__dirname, 'do_uong_co_con_ancohol', `${baseImageName}${ext}`),
      ),
      ...imageExtensions.map((ext) =>
        path.join(__dirname, 'do_uong_co_con_ancohol', `${baseImageName}_1${ext}`),
      ),
      ...imageExtensions.map((ext) =>
        path.join(__dirname, 'do_uong_co_con_ancohol', `${baseImageName}_2${ext}`),
      ),
      ...imageExtensions.map((ext) =>
        path.join(__dirname, 'do_uong_co_con_ancohol', `${baseImageName}_3${ext}`),
      ),
    ];

    const uploadedImages: string[] = [];

    for (const imgPath of imagePaths) {
      if (fs.existsSync(imgPath)) {
        try {
          const url = await uploadImage(imgPath);
          uploadedImages.push(url);
        } catch {
          console.warn(`⚠️ Failed to upload image: ${imgPath}`);
        }
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
          discount_price,
          slug,
          images: uploadedImages,
          status,
          views,
          ordered_count,
          rating_count,
          rating,
          average_rating,
          favorites_count,
          categories: [cateId],
          countInStock,
          recommend,
          alcohol_type,
          origin,
          alcohol_content,
          volume,
          isDishNew: Math.random() > 0.5,
          newUntil: Math.random() > 0.5 ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null,
          totalSoldQuantity,
          discountUntil:
            discount_price && Math.random() > 0.5
              ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              : null,
        });

        await dish.save();
        console.log(`✅ Saved: ${name}`);
      } catch (err) {
        console.error(`❌ Failed to save dish "${name}":`, err);
      }
    } else {
      console.warn(`⚠️ No images uploaded for dish "${name}". Skipping creation.`);
    }
  }

  console.log('🥳 Import hoàn tất!');
  process.exit();
};

run().catch((err) => {
  console.error('❌ Error running the import process:', err);
  process.exit(1);
});

const deleteAllCloudinaryImagesInFolder = async (folder: string) => {
  try {
    const { resources } = await cloudinary.api.resources({
      type: 'upload',
      prefix: `${folder}/`,
      max_results: 500,
    });

    const publicIds = resources.map((res: any) => res.public_id);

    if (publicIds.length > 0) {
      await cloudinary.api.delete_resources(publicIds);
      console.log(`🗑️ Deleted ${publicIds.length} images from Cloudinary folder "${folder}"`);
    } else {
      console.log(`📂 No images found in folder "${folder}"`);
    }
  } catch (err) {
    console.error(`❌ Failed to delete images in folder "${folder}"`, err);
  }
};
