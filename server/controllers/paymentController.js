const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const createRestaurantPaymentSession = async (req, res) => {
  try {
    const restaurantId = req.body.id;
    if (!restaurantId) {
      return res.status(400).json({ error: "No restaurant ID provided" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      line_items: [
        {
          //SubscriptionFee
          price: "price_1NJzvrIHnXNDucDdgXDComqj",
          quantity: 1,
        },
        {
          // pay-per-click Subscription
          price: "price_1NJzvrIHnXNDucDdNm2Ejxb9",
        },
      ],
      mode: "subscription",
      metadata: {
        restaurantId: restaurantId,
      },
      success_url: `${process.env.CLIENT_URL}/restaurants/successPaymentRestaurant/${restaurantId}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/restaurants/cancelPaymentRestaurant/${restaurantId}?session_id={CHECKOUT_SESSION_ID}`,
    });

    res.status(200).json({ url: session.url });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const createUserPaymentSession = async (req, res) => {
  try {
    const userId = req.body.id;
    const selectedPlan = req.body.plan;
    if (!userId) {
      return res.status(400).json({ error: "No user ID provided" });
    }
    if (!selectedPlan) {
      return res.status(400).json({ error: "No plan provided" });
    }
    let price;

    // Select subscription according to selected Plan
    if (selectedPlan === "monthly") {
      price = "price_1NNze1IHnXNDucDdEygFVP9L";
    } else if (selectedPlan === "annual") {
      price = "price_1NVEjPIHnXNDucDdqj8VrOju";
    } else {
      return res.status(400).json({ error: "No valid plan provided" });
    }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        billing_address_collection: "auto",
        line_items: [
          {
            price: price,
            quantity: 1,
          },
        ],
        mode: "subscription",
        metadata: {
          userId: userId,
        },
        success_url: `${process.env.CLIENT_URL}/successPaymentUser/${userId}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/cancelPaymentUser/${userId}?session_id={CHECKOUT_SESSION_ID}`,
      });

    res.status(200).json({ url: session.url });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Export functions
module.exports = {
  createRestaurantPaymentSession,
  createUserPaymentSession,
};
