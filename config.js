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
            ? "price_1Q8opoLWN7g4oB0YwsxO5Sjh"
            : "price_1Q8opoLWN7g4oB0YwsxO5Sjh",
        name: "Monthly",
        mode: "subscription",
        description: "Unlimited access to NotesToQuiz",
        price: 19.99,
        priceAnchor: 29.99,
        features: [
          { name: "Unlimited quiz generation tokens" },
          { name: "Unlimited characters" },
          { name: "Access to 15+ question quizzes" },
          { name: "Access to all question types" },
        ],
        buttonMessage: "Low commitment, high reward",
        perMonthPrice: 1.99,
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
    toast: "#4f46e5",
  },
  auth: {
    loginUrl: "/api/auth/signin",
    callbackUrl: "/",
  },
  googleAnalyticsId: "G-KBX6PL09QD",
};

export default config;
