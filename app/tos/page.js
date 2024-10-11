import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

// CHATGPT PROMPT TO GENERATE YOUR TERMS & SERVICES — replace with your own data 👇

// 1. Go to https://chat.openai.com/
// 2. Copy paste bellow
// 3. Replace the data with your own (if needed)
// 4. Paste the answer from ChatGPT directly in the <pre> tag below

// You are an excellent lawyer.

// I need your help to write a simple Terms & Services for my website. Here is some context:
// - Website: https://shipfa.st
// - Name: ShipFast
// - Contact information: marc@shipfa.st
// - Description: A JavaScript code boilerplate to help entrepreneurs launch their startups faster
// - Ownership: when buying a package, users can download code to create apps. They own the code but they do not have the right to resell it. They can ask for a full refund within 7 day after the purchase.
// - User data collected: name, email and payment information
// - Non-personal data collection: web cookies
// - Link to privacy-policy: https://shipfa.st/privacy-policy
// - Governing Law: France
// - Updates to the Terms: users will be updated by email

// Please write a simple Terms & Services for my site. Add the current date. Do not add or explain your reasoning. Answer:

export const metadata = getSEOTags({
  title: `Terms and Conditions | ${config.appName}`,
  canonicalUrlRelative: "/tos",
});

const TOS = () => {
  return (
    <main className="bg-white text-neutral-700">
      <div className="max-w-xl mx-auto bg-white text-neutral-700">
        <div className="p-5">
          <Link href="/" className="btn btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
                clipRule="evenodd"
              />
            </svg>
            Back
          </Link>
          <h1 className="text-3xl font-extrabold pb-6">
            Terms and Conditions for {config.appName}
          </h1>

          <pre
            className="leading-relaxed whitespace-pre-wrap"
            style={{ fontFamily: "sans-serif" }}
          >
            {`Last Updated: October 11, 2024

Welcome to NotesToQuiz (the "Website"). These Terms & Services ("Terms") govern your use of the Website operated by NotesToQuiz ("we," "our," or "us"). By accessing or using the Website, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use the Website.

1. Use of the Website

You may use the Website solely for personal, non-commercial purposes. You agree not to use the Website for any unlawful or prohibited activities. We reserve the right to terminate your access to the Website at any time without notice.

2. User Data

By using the Website, you consent to the collection and use of your personal data, including your name, email, phone number, and payment information, as outlined in our Privacy Policy. You also agree to the use of web cookies for non-personal data collection.

3. Payment

All payments made on the Website are subject to our payment terms. You are responsible for providing accurate and complete payment information.

4. Intellectual Property

All content on the Website, including text, graphics, logos, and software, is the property of NotesToQuiz and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works from any content on the Website without our express written permission.

5. Limitation of Liability

We are not liable for any direct, indirect, incidental, or consequential damages arising from your use of the Website. Your use of the Website is at your own risk.

6. Governing Law

These Terms are governed by the laws of the United States. Any disputes arising under these Terms shall be resolved in the courts of the United States.

7. Changes to the Terms

We may update these Terms from time to time. If we make any changes, we will notify you by email. Your continued use of the Website after such changes constitutes your acceptance of the new Terms.

8. Contact Information

If you have any questions about these Terms, please contact us at matt@mg.notestoquiz.com.`}
          </pre>
        </div>
      </div>
    </main>
  );
};

export default TOS;
