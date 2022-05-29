import { createTransport, createTestAccount, getTestMessageUrl } from 'nodemailer';

// create reusable transporter object using the default SMTP transport
let transport = createTransport({
  host: process.env.MAIL_HOST,
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
  },
});

function makeANiceEmail(text: string): string {
    return `
      <div className="email" style="
        border: 1px solid black;
        padding: 20px;
        font-family: sans-serif;
        line-height: 2;
        font-size: 20px;
      ">
        <h2>Hello There!</h2>
        <p>${text}</p>
        <p>😘, Wes Bos</p>
      </div>
    `;
}

//Отправка письма с помощью сервиса https://ethereal.email/
export async function sendPasswordResetEmail(resetToken: string, to: string): Promise<void> {

    const info = await transport.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>',
        to: to,
        subject: "Your password reset token! ✔",
        text: "Your Password Reset Token is here!", // plain text body
        html: makeANiceEmail(`
            <a href="${process.env.FRONTEND_URL}/reset?token=${resetToken}">
                Click Here to reset
            </a>
        `),
    });

    //Выведем в консоль Ubuntu данные по письму
    //console.log(info);

    //Если мы отправляем письма через сервис ethereal.email тогда выведим ссылку на письмо в консоль
    //Ссылка формируется через метод getTestMessageUrl
    if (process.env.MAIL_USER.includes('ethereal.email')) {
        console.log(`💖 Message sent! Preview it at ${getTestMessageUrl(info)}`);
    }

}


