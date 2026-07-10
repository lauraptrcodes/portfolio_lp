import { Resend } from 'resend';
import { RESEND_API_KEY } from '$env/static/private';
import { fail } from '@sveltejs/kit';

const resend = new Resend(RESEND_API_KEY);
// TODO: durch eine bei Resend verifizierte Absender-Adresse ersetzen (eigene Domain nötig,
// bis dahin funktioniert nur die Test-Adresse "onboarding@resend.dev")
const FROM_EMAIL = 'contact@laurapeter.dev';

// TODO: durch deine eigene Ziel-Adresse ersetzen, an die die Kontaktanfragen gehen sollen
const TO_EMAIL = 'laura.peter258@gmail.com';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name')?.toString().trim() ?? '';
		const email = data.get('email')?.toString().trim() ?? '';
		const message = data.get('message')?.toString().trim() ?? '';

		if (!email || !message) {
			return fail(400, {
				error: 'Bitte E-Mail und Nachricht ausfüllen.',
				name,
				email,
				message
			});
		}

		try {
			await resend.emails.send({
				from: FROM_EMAIL,
				to: TO_EMAIL,
				replyTo: email,
				subject: `Neue Kontaktanfrage von ${name || 'Unbekannt'}`,
				text: `Name: ${name}\nE-Mail: ${email}\n\nNachricht:\n${message}`
			});
		} catch (err) {
			console.error('Resend error:', err);
			return fail(500, {
				error: 'Beim Versenden ist etwas schiefgelaufen. Bitte später erneut versuchen.',
				name,
				email,
				message
			});
		}

		return { success: true };
	}
};
