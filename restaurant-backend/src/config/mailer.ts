import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
// const hbs = await import('nodemailer-express-handlebars');
import path from 'path';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

transporter.use(
  'compile',
  hbs({
    viewEngine: {
      extname: '.hbs',
      partialsDir: path.resolve(__dirname, '../views'),
      defaultLayout: '', 
    },
    viewPath: path.resolve(__dirname, '../views'),
    extName: '.hbs',
  }),
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
