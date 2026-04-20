import { authenticate } from "../shopify.server";
import { sendEmail } from "../utils/sendEmail";

export const action = async ({ request }) => {
  try {
    const { payload, shop } = await authenticate.webhook(request);

    const storeOwnerEmail = payload.customer.email;
    // const storeOwnerEmail = "[EMAIL_ADDRESS]";

    const data = {
      message: "We are not collecting any personal data. This email is just to confirm that we received your data request and to provide you with some information about our app. We are committed to protecting your privacy and ensuring that your data is handled securely. If you have any questions or concerns, please feel free to contact us.",
    }

    await sendEmail({
      to: storeOwnerEmail,
      subject: "Requested customer data export",
      templateName: "UserData",
      templateData: {
        data,
        buttonUrl: shop ? `https://${payload.shop_domain}` : "",
      },
    });


    return new Response("OK", {
      status: 200,
      statusText: "OK",
    });
  } catch (error) {
    console.error("[customers/data_request] failed", error);
    return new Response("Unauthorized", { status: 401 });
  }
};
