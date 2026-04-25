import { csvProspectRowSchema, type Prospect } from "@/types/domain";
import { DATA_AS_OF } from "@/data/seed/sources";

export type ProspectImportResult = {
  prospects: Prospect[];
  errors: string[];
};

const headers = [
  "name",
  "school",
  "position",
  "positionGroup",
  "projectedMin",
  "projectedMax",
  "consensusRank",
  "nflIqOverall",
  "athleticism",
  "production",
  "readiness",
  "traits",
  "sourceUrl",
] as const;

export const prospectCsvTemplate = headers.join(",");

function splitCsvLine(line: string) {
  const cells: string[] = [];
  let current = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && next === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      quoted = !quoted;
      continue;
    }

    if (char === "," && !quoted) {
      cells.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  cells.push(current.trim());
  return cells;
}

export function parseProspectCsv(csv: string): ProspectImportResult {
  const lines = csv
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return { prospects: [], errors: ["CSV is empty."] };
  }

  const incomingHeaders = splitCsvLine(lines[0]);
  const missingHeaders = headers.filter((header) => !incomingHeaders.includes(header));

  if (missingHeaders.length > 0) {
    return {
      prospects: [],
      errors: [`Missing headers: ${missingHeaders.join(", ")}.`],
    };
  }

  const prospects: Prospect[] = [];
  const errors: string[] = [];

  lines.slice(1).forEach((line, lineIndex) => {
    const cells = splitCsvLine(line);
    const row = Object.fromEntries(
      incomingHeaders.map((header, index) => [header, cells[index] ?? ""]),
    );
    const parsed = csvProspectRowSchema.safeParse(row);

    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      const fieldPath = issue?.path.join(".");
      const message = issue?.message ?? "invalid row";
      errors.push(
        fieldPath
          ? `Line ${lineIndex + 2}: ${fieldPath} — ${message}.`
          : `Line ${lineIndex + 2}: ${message}.`,
      );
      return;
    }

    prospects.push({
      name: parsed.data.name,
      school: parsed.data.school,
      position: parsed.data.position,
      positionGroup: parsed.data.positionGroup,
      projectedRange: {
        min: parsed.data.projectedMin,
        max: parsed.data.projectedMax,
      },
      consensusRank: parsed.data.consensusRank ?? null,
      nflIqOverall: parsed.data.nflIqOverall,
      athleticism: parsed.data.athleticism,
      production: parsed.data.production,
      readiness: parsed.data.readiness,
      roleFits: { [parsed.data.positionGroup]: 0.75 },
      traits: parsed.data.traits.split("|").map((trait) => trait.trim()).filter(Boolean),
      sourceRefs: [
        {
          label: "Manual NFL IQ import",
          url: parsed.data.sourceUrl,
          retrievedAt: DATA_AS_OF,
          note: "User-provided CSV import row.",
        },
      ],
      status: "available",
    });
  });

  return { prospects, errors };
}
