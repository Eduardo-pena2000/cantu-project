import { randomUUID } from "crypto";

type CodeType = "area" | "job_role" | "team";

export const generateCode = (type: CodeType): string => {
  const prefixes: Record<CodeType, string> = {
    area: "AR",
    job_role: "ET",
    team: "EQ",
  };

  const uuid = randomUUID().replace(/-/g, "");

  const shortPart = uuid.substring(0, 6).toUpperCase();

  return `${prefixes[type]}-${shortPart}`;
};
