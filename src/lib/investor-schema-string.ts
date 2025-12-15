import { zodToJsonSchema } from "zod-to-json-schema";
import { investorDashboardSchema } from "./investor-schema";

// Convert Zod schema to JSON Schema for LLM prompts
export const investorDashboardJsonSchema = zodToJsonSchema(
  investorDashboardSchema,
  "InvestorDashboard"
);

// Pre-stringify for direct embedding in prompts
export const investorDashboardSchemaString = JSON.stringify(
  investorDashboardJsonSchema,
  null,
  2
);
