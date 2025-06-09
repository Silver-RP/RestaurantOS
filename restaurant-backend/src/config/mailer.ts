import nodemailer from 'nodemailer';
import path from 'path';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

// 👇 Export function khởi tạo handlebars chứ KHÔNG dùng top-level await
export const initializeHandlebars = async () => {
  try {
    const hbs = (await import('nodemailer-express-handlebars')).default;

    transporter.use(
      'compile',
      hbs({
        viewEngine: {
          extname: '.hbs',
          partialsDir: path.resolve(__dirname, '../views'),
          defaultLayout: false,
        },
        viewPath: path.resolve(__dirname, '../views'),
        extName: '.hbs',
      }),
    );

    console.log('✅ Handlebars initialized!');
  } catch (err) {
    console.error('❌ Failed to initialize handlebars:', err);
  }
};

export default transporter;
