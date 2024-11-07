import { NextResponse } from "next/server";
import { sendEmail } from "@/libs/mailgun";
import config from "@/config";

// This route is used to receive emails from Mailgun and forward them to our customer support email.
// See more: https://shipfa.st/docs/features/emails
export async function POST(req) {
  try {
    const formData = await req.formData();
    const sender = formData.get("From");
    const subject = formData.get("Subject");
    let html = formData.get("body-html");
    const plainText = formData.get("body-plain");

    // If HTML is null, use plain text content
    if (!html && plainText) {
      html = `<pre>${plainText}</pre>`;
    }

    if (
      config.mailgun.forwardRepliesTo &&
      (html || plainText) &&
      subject &&
      sender
    ) {
      try {
        await sendEmail({
          to: config.mailgun.forwardRepliesTo,
          subject: `${config?.appName} | ${subject}`,
          html: `<div>
            <p><b>- Subject:</b> ${subject}</p>
            <p><b>- From:</b> ${sender}</p>
            <p><b>- Content:</b></p>
            <div>${html || plainText}</div>
          </div>`,
          text: plainText, // Include plain text version
          replyTo: sender,
        });
      } catch (emailError) {
        console.error("Error forwarding email:", emailError);
        return NextResponse.json(
          { error: "Failed to forward email" },
          { status: 500 }
        );
      }
    } else {
      console.log("Not forwarding email due to missing information");
      console.log("Missing fields:", {
        forwardRepliesTo: !config.mailgun.forwardRepliesTo,
        content: !(html || plainText),
        subject: !subject,
        sender: !sender,
      });
    }

    return NextResponse.json({ status: "success" });
  } catch (e) {
    console.error("Error in Mailgun webhook:", e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
