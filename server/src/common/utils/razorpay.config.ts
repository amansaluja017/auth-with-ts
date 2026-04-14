import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.ROZARPAY_TEST_API_KEY!,
    key_secret: process.env.ROZARPAY_TEST_API_KEY_SECRET!
});

export default razorpay;
