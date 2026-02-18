import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendMagicLink = async ({ email, url }: { email: string, token: string, url: string }) => {
    try {
        await resend.emails.send({
            from: 'App <noreply@example.com>',
            to: email,
            subject: 'Sign in to your account',
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
            from: 'App <welcome@example.com>',
            to: email,
            subject: 'Welcome!',
            html: `<p>Thanks for joining. We're glad to have you.</p>`
        });
    } catch (error) {
        console.error('Error sending welcome email:', error);
    }
};
