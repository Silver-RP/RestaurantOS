/* eslint-disable @typescript-eslint/no-require-imports */
import nodemailer from 'nodemailer';
import path from 'path';
// import hbs from 'nodemailer-express-handlebars';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

const initializeHandlebars = async () => {
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

initializeHandlebars().catch((err) =>
  console.error('Unhandled error during initializeHandlebars call:', err),
);

export default transporter;

