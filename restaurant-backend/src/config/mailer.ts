/* eslint-disable @typescript-eslint/no-require-imports */
console.log('➡️ [MailerConfig] mailer.ts is being loaded.');
import nodemailer from 'nodemailer';
import path from 'path';
import hbs from 'nodemailer-express-handlebars';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

// Initialize handlebars with dynamic import
const initializeHandlebars = async () => {
  try {
    console.log('⚙️ [MailerConfig] Attempting to initialize Handlebars...');
    console.log('⚙️ [MailerConfig] About to import nodemailer-express-handlebars...');
    const hbs = (await import('nodemailer-express-handlebars')).default;
    console.log('✅ [MailerConfig] nodemailer-express-handlebars imported successfully.');
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
    console.log(
      '✅ [MailerConfig] Handlebars initialized successfully and applied to transporter.',
    );

    // Verify transporter configuration
    transporter.verify(function (error) {
      if (error) {
        console.error('❌ [MailerConfig] Mailer verification error:', error);
      } else {
        console.log('✔️ [MailerConfig] Mailer is ready to send emails.');
      }
    });
  } catch (error) {
    console.error(
      '❌ [MailerConfig] Caught error during Handlebars initialization or mailer setup:',
      error,
    );
  }
};

// Call the initialization
initializeHandlebars().catch((err) =>
  console.error('Unhandled error during initializeHandlebars call:', err),
);

export default transporter;



// import nodemailer from 'nodemailer';
// import path from 'path';

// export const createTransporter = async () => {
//   const { default: hbs } = await import('nodemailer-express-handlebars');

//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.MAIL_USERNAME,
//       pass: process.env.MAIL_PASSWORD,
//     },
//   });

//   transporter.use(
//     'compile',
//     hbs({
//       viewEngine: {
//         extname: '.hbs',
//         partialsDir: path.resolve(__dirname, '../views'),
//         defaultLayout: false,
//       },
//       viewPath: path.resolve(__dirname, '../views'),
//       extName: '.hbs',
//     }),
//   );

//   return transporter;
// };
