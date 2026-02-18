import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendMagicLink = async ({ email, url }: { email: string, token: string, url: string }) => {
    try {
        await resend.emails.send({
            from: 'Waredeck <noreply@waredeck.com>',
            to: email,
            subject: 'Sign in to Waredeck',
            html: `<p>Click the link below to sign in:</p><a href="${url}">${url}</a>`
        });
    } catch (error) {
        console.error('Error sending magic link:', error);
        throw new Error('Failed to send magic link');
    }
};

export const sendWelcomeEmail = async (email: string) => {
    try {
        await resend.emails.send({
            from: 'Waredeck <welcome@waredeck.com>',
            to: email,
            subject: 'Welcome to Waredeck!',
            html: `<p>Thanks for joining Waredeck. We're glad to have you.</p>`
        });
    } catch (error) {
        console.error('Error sending welcome email:', error);
    }
};
