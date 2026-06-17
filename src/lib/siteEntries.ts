export type SiteEntry = {
  id: number;
  siteName: string;
  coordinates: string;
  gridSubstation: string;
  distanceToGssKm: number | null;
  extentAvailableAcres: string;
  distanceTo33KvaLineKm: string;
  accessibility: string;
  roadWidthFt: string;
  dsDivision: string;
  gnDivision: string;
  terrain: string;
  susceptibleToFlood: string;
  landOwnershipType: string;
  registrationDeedAvailable: string;
  approvedPlanAvailable: string;
  transactionMethod: string;
  expectedPricePerPerchRs: string;
  leaseValuePerPerchPerMonthRs: string;
  ownerContactPerson: string;
  contactNumber: string;
  presentLandUse: string;
  surroundingLandUse: string;
  inspectedBy: string;
  inspectorContact: string;
};

export type SiteEntryFormValues = Omit<
  SiteEntry,
  "id" | "coordinates" | "gridSubstation" | "distanceToGssKm"
>;

export const emptySiteEntryFormValues: SiteEntryFormValues = {
  siteName: "",
  extentAvailableAcres: "",
  distanceTo33KvaLineKm: "",
  accessibility: "",
  roadWidthFt: "",
  dsDivision: "",
  gnDivision: "",
  terrain: "",
  susceptibleToFlood: "",
  landOwnershipType: "",
  registrationDeedAvailable: "",
  approvedPlanAvailable: "",
  transactionMethod: "",
  expectedPricePerPerchRs: "",
  leaseValuePerPerchPerMonthRs: "",
  ownerContactPerson: "",
  contactNumber: "",
  presentLandUse: "",
  surroundingLandUse: "",
  inspectedBy: "",
  inspectorContact: "",
};

export function siteEntryToFormValues(entry: SiteEntry): SiteEntryFormValues {
  return {
    siteName: entry.siteName,
    extentAvailableAcres: entry.extentAvailableAcres,
    distanceTo33KvaLineKm: entry.distanceTo33KvaLineKm,
    accessibility: entry.accessibility,
    roadWidthFt: entry.roadWidthFt,
    dsDivision: entry.dsDivision,
    gnDivision: entry.gnDivision,
    terrain: entry.terrain,
    susceptibleToFlood: entry.susceptibleToFlood,
    landOwnershipType: entry.landOwnershipType,
    registrationDeedAvailable: entry.registrationDeedAvailable,
    approvedPlanAvailable: entry.approvedPlanAvailable,
    transactionMethod: entry.transactionMethod,
    expectedPricePerPerchRs: entry.expectedPricePerPerchRs,
    leaseValuePerPerchPerMonthRs: entry.leaseValuePerPerchPerMonthRs,
    ownerContactPerson: entry.ownerContactPerson,
    contactNumber: entry.contactNumber,
    presentLandUse: entry.presentLandUse,
    surroundingLandUse: entry.surroundingLandUse,
    inspectedBy: entry.inspectedBy,
    inspectorContact: entry.inspectorContact,
  };
}

export const siteEntryExcelHeaders = [
  "No",
  "Site Name",
  "Coordinates of the Identified Land",
  "Selected Grid Substation",
  "Distance to GSS (Kms)",
  "Extent Available (Acres)",
  "Distance to 33 KVA Line (Kms)",
  "Accessibility",
  "Road Width (Ft)",
  "D.S. Division",
  "G.N. Division",
  "Terrain",
  "Susceptibility to Flood",
  "Type of the Land Ownership",
  "Availability of Registration Deed",
  "Availability of Approved Plan",
  "Method of Transaction",
  "Expected Price of a Perch (Rs)",
  "Approx. Value of Perch per Month (Rs)",
  "Name of the Owner / Contact Person",
  "Contact Number",
  "Present Land Use",
  "Surrounding Land Use / Land Cover",
  "Inspected by (Name)",
  "Inspector Contact",
] as const;

export function siteEntryToExcelRow(entry: SiteEntry) {
  return {
    "No": entry.id,
    "Site Name": valueOrNull(entry.siteName),
    "Coordinates of the Identified Land": valueOrNull(entry.coordinates),
    "Selected Grid Substation": valueOrNull(entry.gridSubstation),
    "Distance to GSS (Kms)": entry.distanceToGssKm,
    "Extent Available (Acres)": valueOrNull(entry.extentAvailableAcres),
    "Distance to 33 KVA Line (Kms)": valueOrNull(entry.distanceTo33KvaLineKm),
    "Accessibility": valueOrNull(entry.accessibility),
    "Road Width (Ft)": valueOrNull(entry.roadWidthFt),
    "D.S. Division": valueOrNull(entry.dsDivision),
    "G.N. Division": valueOrNull(entry.gnDivision),
    "Terrain": valueOrNull(entry.terrain),
    "Susceptibility to Flood": valueOrNull(entry.susceptibleToFlood),
    "Type of the Land Ownership": valueOrNull(entry.landOwnershipType),
    "Availability of Registration Deed": valueOrNull(entry.registrationDeedAvailable),
    "Availability of Approved Plan": valueOrNull(entry.approvedPlanAvailable),
    "Method of Transaction": valueOrNull(entry.transactionMethod),
    "Expected Price of a Perch (Rs)": valueOrNull(entry.expectedPricePerPerchRs),
    "Approx. Value of Perch per Month (Rs)": valueOrNull(
      entry.leaseValuePerPerchPerMonthRs
    ),
    "Name of the Owner / Contact Person": valueOrNull(entry.ownerContactPerson),
    "Contact Number": valueOrNull(entry.contactNumber),
    "Present Land Use": valueOrNull(entry.presentLandUse),
    "Surrounding Land Use / Land Cover": valueOrNull(entry.surroundingLandUse),
    "Inspected by (Name)": valueOrNull(entry.inspectedBy),
    "Inspector Contact": valueOrNull(entry.inspectorContact),
  };
}

export function excelRowToSiteEntry(
  row: Record<string, unknown>,
  fallbackId: number
): SiteEntry {
  return {
    id: numberFromExcelValue(row["No"]) ?? fallbackId,
    siteName: stringFromExcelValue(row["Site Name"]),
    coordinates: stringFromExcelValue(row["Coordinates of the Identified Land"]),
    gridSubstation: stringFromExcelValue(row["Selected Grid Substation"]),
    distanceToGssKm: numberFromExcelValue(row["Distance to GSS (Kms)"]),
    extentAvailableAcres: stringFromExcelValue(row["Extent Available (Acres)"]),
    distanceTo33KvaLineKm: stringFromExcelValue(
      row["Distance to 33 KVA Line (Kms)"]
    ),
    accessibility: stringFromExcelValue(row["Accessibility"]),
    roadWidthFt: stringFromExcelValue(row["Road Width (Ft)"]),
    dsDivision: stringFromExcelValue(row["D.S. Division"]),
    gnDivision: stringFromExcelValue(row["G.N. Division"]),
    terrain: stringFromExcelValue(row["Terrain"]),
    susceptibleToFlood: stringFromExcelValue(row["Susceptibility to Flood"]),
    landOwnershipType: stringFromExcelValue(row["Type of the Land Ownership"]),
    registrationDeedAvailable: stringFromExcelValue(
      row["Availability of Registration Deed"]
    ),
    approvedPlanAvailable: stringFromExcelValue(
      row["Availability of Approved Plan"]
    ),
    transactionMethod: stringFromExcelValue(row["Method of Transaction"]),
    expectedPricePerPerchRs: stringFromExcelValue(
      row["Expected Price of a Perch (Rs)"]
    ),
    leaseValuePerPerchPerMonthRs: stringFromExcelValue(
      row["Approx. Value of Perch per Month (Rs)"]
    ),
    ownerContactPerson: stringFromExcelValue(
      row["Name of the Owner / Contact Person"]
    ),
    contactNumber: stringFromExcelValue(row["Contact Number"]),
    presentLandUse: stringFromExcelValue(row["Present Land Use"]),
    surroundingLandUse: stringFromExcelValue(
      row["Surrounding Land Use / Land Cover"]
    ),
    inspectedBy: stringFromExcelValue(row["Inspected by (Name)"]),
    inspectorContact: stringFromExcelValue(row["Inspector Contact"]),
  };
}

function valueOrNull(value: string): string | null {
  const trimmedValue = value.trim();

  return trimmedValue === "" ? null : trimmedValue;
}

function stringFromExcelValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
}

function numberFromExcelValue(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== "string") {
    return null;
  }

  const parsedValue = Number.parseFloat(value.replace(/,/g, ""));

  return Number.isFinite(parsedValue) ? parsedValue : null;
}
