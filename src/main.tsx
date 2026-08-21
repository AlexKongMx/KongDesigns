import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./site/App";
import PricingPage from "./pricing/PricingPage";
import "./site/styles.css";
import "./experience/experience.css";
import "./site/hero-fix.css";
import "./pricing/pricing.css";

const isPricingPage = window.location.pathname.replace(/\/+$/,"") === "/precios";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {isPricingPage ? <PricingPage /> : <App />}
  </StrictMode>,
);
