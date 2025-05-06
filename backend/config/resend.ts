import dotenv from "dotenv";
dotenv.config();

import { Resend } from "resend";
import handlebars from "handlebars";

const resend = new Resend(process.env.RESEND_API_KEY!);

export const sendEmail = async (
	to: string | string[],
	subject: string,
	body: string, // Handlebars HTML string
	variables: Record<string, any>
) => {
	const template = handlebars.compile(body);
	const html = template(variables);

	try {
		const { data, error } = await resend.emails.send({
			from: "Foster Source <onboarding@resend.dev>",
			to,
			subject,
			html,
		});

		if (error) {
			console.error("Email send error:", error);
			throw new Error("Failed to send email");
		}
	} catch (err) {
		console.error(err);
		throw err;
	}
};
