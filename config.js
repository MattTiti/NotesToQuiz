import themes from "daisyui/src/theming/themes";

const config = {
  appName: "NotesToQuiz",
  appDescription: "The easiest way to generate quizzes from your notes",
  domainName: "notestoquiz.com",
  crisp: {
    id: "",
    onlyShowOnRoutes: ["/"],
  },
  stripe: {
    plans: [
      {
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1Q4jjPCKVO6FKkF1pPndI3hV"
            : "price_1Q4jjPCKVO6FKkF1pPndI3hV",
        name: "Monthly",
        mode: "subscription",
        description: "Daily text subscription billed monthly",
        price: 3.99,
        priceAnchor: 7.99,
        features: [
          { name: "Daily message service (Text & Email)" },
          { name: "Message customization" },
          { name: "GoodMornin Dashboard" },
        ],
        buttonMessage: "Low commitment, high reward",
      },
    ],
  },
  mailgun: {
    subdomain: "mg",
    fromNoReply: `NotesToQuiz <noreply@mg.notestoquiz.com>`,
    fromAdmin: `Matt at NotesToQuiz <matt@mg.notestoquiz.com>`,
    supportEmail: "matt@mg.notestoquiz.com",
    forwardRepliesTo: "matthewtiti@gmail.com",
  },
  colors: {
    theme: "dark",
    main: themes["dark"]["primary"],
    toast: "#eab308",
  },
  auth: {
    loginUrl: "/api/auth/signin",
    callbackUrl: "/custom",
  },
  googleAnalyticsId: "",
};

export default config;
