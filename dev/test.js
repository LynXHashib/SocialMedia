const { transporter } = require('../modules/app');

const sendMail = async () => {
  try {
    const info = await transporter.sendMail({
      from: '"Social Media App"<contact@localhost.com>', // sender address
      to: 'hashib4305@gmail.com, hashib4305@gmail.com', // list of receivers
      subject: 'Hello', // Subject line
      html: '<b>Hello world?</b><h1 style="color:blue;text-align:center;">Hello World</h1>',
    });
    console.log('Message sent: %s', info.messageId);
  } catch (err) {
    console.error('Error while sending mail', err);
  }
};

console.log(
  Math.floor(Math.random() * 10) +
    Math.floor(Math.random() * 100) +
    Math.floor(Math.random() * 1000)
);
