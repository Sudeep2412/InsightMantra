import {
  benefitIcon1,
  benefitIcon2,
  benefitIcon3,
  benefitIcon4,
  benefitImage2,
  discordBlack,
  facebook,
  instagram,
  telegram,
  twitter,
} from "../assets";

export const navigation = [
  { id: "0", title: "Home", url: "/" },
  { id: "1", title: "Dashboard", url: "/dashboard" },
  { id: "2", title: "Product Search", url: "/intercept" },
  { id: "3", title: "Upload Data", url: "/data-fusion" }
];

export const heroIcons = [];

export const notificationImages = [];

export const companyLogos = [];

export const benefits = [
  {
    id: "0",
    title: "Multi-Platform Search",
    text: "Search and compare products across eBay, Snapdeal, Meesho, and more — all from one place.",
    backgroundUrl: "./src/assets/benefits/card-1.svg",
    iconUrl: benefitIcon1,
    imageUrl: benefitImage2,
    light: true,
  },
  {
    id: "1",
    title: "Easy Data Upload",
    text: "Upload your sales data in CSV or JSON format to generate custom forecasts.",
    backgroundUrl: "./src/assets/benefits/card-2.svg",
    iconUrl: benefitIcon2,
    imageUrl: benefitImage2,
    light: true,
  },
  {
    id: "2",
    title: "Sales Forecasting",
    text: "AI-powered demand predictions with trend analysis and confidence intervals.",
    backgroundUrl: "./src/assets/benefits/card-3.svg",
    iconUrl: benefitIcon3,
    imageUrl: benefitImage2,
    light: true,
  },
  {
    id: "3",
    title: "Sentiment Analysis",
    text: "Understand customer sentiment from product reviews to make better decisions.",
    backgroundUrl: "./src/assets/benefits/card-4.svg",
    iconUrl: benefitIcon4,
    imageUrl: benefitImage2,
    light: true,
  },
  {
    id: "4",
    title: "Market Share Analysis",
    text: "Compare brand performance with radar charts and competitive benchmarks.",
    backgroundUrl: "./src/assets/benefits/card-5.svg",
    iconUrl: benefitIcon1,
    imageUrl: benefitImage2,
    light: true,
  },
  {
    id: "5",
    title: "Scenario Simulation",
    text: "Test what-if scenarios by adjusting price and sentiment to see how demand changes.",
    backgroundUrl: "./src/assets/benefits/card-6.svg",
    iconUrl: benefitIcon2,
    imageUrl: benefitImage2,
    light: true,
  },
];

export const socials = [
  {
    id: "0",
    title: "Discord",
    iconUrl: discordBlack,
    url: "#",
  },
  {
    id: "1",
    title: "Twitter",
    iconUrl: twitter,
    url: "#",
  },
  {
    id: "2",
    title: "Instagram",
    iconUrl: instagram,
    url: "#",
  },
  {
    id: "3",
    title: "Telegram",
    iconUrl: telegram,
    url: "#",
  },
  {
    id: "4",
    title: "Facebook",
    iconUrl: facebook,
    url: "#",
  },
];