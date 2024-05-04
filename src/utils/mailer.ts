import nodemailer from 'nodemailer';
import { IUser } from '../models/user';
import log4js from '../config/log4js';
const logger = log4js.getLogger(`mailer`);

export const mailer = async (user: IUser, token: string): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });
  await transporter.verify();

  const optionsForgot = {
    from: process.env.GMAIL_USER,
    to: user.email,
    subject: 'MovieGo - 忘記密碼驗證服務',
    html: `
    <h2>忘記密碼</h2>
    <p> ${user.name}，您好: <br />
       您在 MovieGo 提出了重設密碼的請求，為了確保您的帳戶安全，請使用以下連結：<br />
       點擊連結後，即可重新設定密碼<br />
        <a href="${process.env.FRONTEND_URL}/user/reset-password?name=${user.name}&token=${token}&email=${user.email}">重設密碼連結</a><br />
       驗證連結於10分鐘後逾期<br />
       如果你並未提出該請求，請您略過這則訊息。<br />
       如果你有任何問題，請聯繫我們：<a href="mailto:${process.env.GMAIL_USER}">${process.env.GMAIL_USER}</a><br />
    </p>
    <p style=color:gray>本郵件請勿直接回覆。</p>
    `,
  };

  transporter.sendMail(optionsForgot).catch((err) => logger.error(err));
};
