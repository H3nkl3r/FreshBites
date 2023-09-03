const Reviewverification = require("../models/Reviewverification");
const UserModel = require("../models/User");
const RestaurantModel = require("../models/Restaurant");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const codeLength = 5;

const generateReviewCodes = async (
  restaurantId,
  amount = 1,
  sendToOwner = false
) => {
  if (!restaurantId) return;

  let codes = [];

  for (let i = 0; i < amount; i++) {
    let code = "";
    const characters = "0123456789";
    const charactersLength = characters.length;
    for (let j = 0; j < codeLength; j++) {
      code += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    codes.push(code);
  }

  try {
    codes.forEach((code) => {
      const verificationObject = new Reviewverification({
        code: code,
        restaurant: restaurantId,
      });
      verificationObject.save();
    });

    if (sendToOwner) {
      let codeEmailContent = "<ul>";
      codes.forEach((code) => {
        codeEmailContent += "<li>" + code + "</li>";
      });
      codeEmailContent += "</ul>";

      const restaurant = await RestaurantModel.findById(restaurantId);
      const owner = await UserModel.findById(restaurant.owner);
      let emailContent = `<p>Dear ${owner.firstName},</p>
                          <p>Congratulations! You have successuly registered your restaurant '${restaurant.name}' on FreshBites. We are very happy to have you on board!</p>
    <p>Also, we are pleased to provide you with exclusive review codes that will allow our community of food lovers to share their experiences and leave reviews for your restaurant, ensuring valuable feedback from a trusted clientele. This ensures prevention of platform misuse and fake reviews. Therefore, we kindly ask you to provide the following review codes to all your customers.</p>
</p> Please do not hesitate to contact us in case of any questions.</p>`;

      emailContent += codeEmailContent;
      emailContent += `<p>Kind regards,</p>`;
      emailContent += `<p>Your FreshBites Team</p>`;

      const msg = {
        to: owner.email,
        from: "discount.freshbites@gmail.com",
        subject: `Your Review Codes for ${restaurant.name}!`,
        html: emailContent,
      };

      await sgMail.send(msg);
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
};

module.exports = {
  generateReviewCodes,
};
