import type { NextConfig } from "next";
import path from "path";

// Load .env from monorepo root in addition to the default Next.js env loading
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });  

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, "../../"),
};

export default nextConfig;
