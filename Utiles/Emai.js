const nodemailer=require('nodemailer')


class SimpleMailTransferProtocol{

  constructor(){

    this.transporter=nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user:process.env.SENDER_EMAIL,
        pass:process.env.SENDER_EMAIL_PASSWORD,
      }
    })


  }


  async orderPlaced(recieverEmail,recieverName,orderDate,orderId){
    
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: recieverEmail,
      subject: 'Your Order is Confirmed',
      html:`
      <table role="presentation" align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="margin: 20px auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);">
      <tr>
        <td style="padding: 20px; text-align: center; color: #4caf50; border-bottom: 2px solid #4caf50;">
          <h2 style="margin: 0;">Order Confirmation</h2>
        </td>
      </tr>
      <tr>
        <td style="padding: 20px; color: #333; font-size: 16px; line-height: 1.6;">
          <p>Dear ${recieverName},</p>
          <p>We are thrilled to confirm that your order has been successfully placed.</p>
          <p><strong>Order Number:</strong> ${orderId}</p>
          <p><strong>Order Date:</strong> ${orderDate}</p>
          <p><strong>Estimated Delivery Time:</strong> 3-5 working days</p>
        </td>
      </tr>
      <tr>
        <td style="padding: 20px; text-align: center; color: #777; font-size: 14px; margin-top: 20px;">
          <p>Thank you for choosing us. If you have any questions or concerns, feel free to contact us.</p>
          <p>Best Regards,<br>The Foodie Bite Team</p>
        </td>
      </tr>
    </table>
      `
    }

    try{  

      const response=await this.transporter.sendMail(mailOptions)
      console.log('Otp Send Successfully to the user')
      return;

    }catch(err){
        
        console.log(err)

    }
  }

  async sendOtp(recieverEmail,otp){

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: recieverEmail,
      subject: 'One time password from foodie Bite Team',
      html:`
      <table style="width: 100%; border-radius: 10px; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; font-family: Arial, sans-serif;">
      <tr>
        <td style="text-align: center;">
          <h2 style="color: #333;">Verification code</h2>
          <p style="color: #555; font-size: 16px; line-height: 1.6;">
            Please use the verification code below to sign in.
          </p>
          <p style="color: #007bff; font-size: 24px; font-weight: bold;">${otp}</p>
          <p style="color: #555; font-size: 16px; line-height: 1.6;">
            If you didn’t request this, you can ignore this email.
          </p>
          <p style="color: #777; font-size: 14px;">Thanks,<br>Foodie Bite Team</p>
        </td>
      </tr>
    </table>  
      `
    };
  
    try{  

        const response=await this.transporter.sendMail(mailOptions)
        console.log('Otp Send Successfully to the user')
        return;

    }catch(err){
        
        console.log(err)

    }


  }

}

const EmailServices=new SimpleMailTransferProtocol();

module.exports=EmailServices;
