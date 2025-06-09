/* eslint-disable @typescript-eslint/no-require-imports */
import nodemailer from 'nodemailer';
import path from 'path';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

// Initialize handlebars with dynamic import
const initializeHandlebars = async () => {
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
};

// Call the initialization
initializeHandlebars().catch(console.error);

export default transporter;
