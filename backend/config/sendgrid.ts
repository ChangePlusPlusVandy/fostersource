import dotenv from "dotenv";
dotenv.config();

import sgMail from "@sendgrid/mail";
import handlebars from "handlebars";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const sendEmail = async (
	to: string | string[],
	subject: string,
	body: string,
	variables: Record<string, any>
) => {
	const template = handlebars.compile(body);
	const html = template(variables);

	const msg = {
		to,
		from: "fostersourcedevs@gmail.com",
		subject,
		html,
	};

	try {
		await sgMail.send(msg);
	} catch (error: any) {
		console.error(error.response?.body || error);
		throw new Error("Failed to send email");
	}
};
