import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const sendEmail = async (
	to: string | string[],
	templateId: string,
	dynamicTemplateData: Record<string, any>
) => {
	const msg = {
		to,
		from: "fostersourcedevs@gmail.com", // Must be a verified sender
		templateId,
		dynamic_template_data: dynamicTemplateData,
	};

	try {
		await sgMail.send(msg);
		console.log("Email sent");
	} catch (error: any) {
		console.error(error.response?.body || error);
		throw new Error("Failed to send email");
	}
};
