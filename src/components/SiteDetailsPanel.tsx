"use client";

import * as React from "react";
import { Check, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { GridStation } from "@/data/gridStations";
import {
  emptySiteEntryFormValues,
  siteEntryToFormValues,
  type SiteEntry,
  type SiteEntryFormValues,
} from "@/lib/siteEntries";

type Coordinates = {
  lat: number;
  lng: number;
};

type SiteDetailsPanelProps = {
  selectedLocation: Coordinates | null;
  selectedStation: GridStation | null;
  distanceToStationKm: number | null;
  nextEntryId: number;
  editingEntry: SiteEntry | null;
  onAddEntry: (entry: SiteEntry) => void;
  onUpdateEntry: (entry: SiteEntry) => void;
  onCancelEdit: () => void;
};

export default function SiteDetailsPanel({
  selectedLocation,
  selectedStation,
  distanceToStationKm,
  nextEntryId,
  editingEntry,
  onAddEntry,
  onUpdateEntry,
  onCancelEdit,
}: Readonly<SiteDetailsPanelProps>) {
  const [formValues, setFormValues] = React.useState<SiteEntryFormValues>(
    () =>
      editingEntry
        ? siteEntryToFormValues(editingEntry)
        : emptySiteEntryFormValues
  );

  const isEditing = editingEntry !== null;
  const coordinatesValue = isEditing
    ? editingEntry.coordinates
    : selectedLocation
    ? `${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`
    : "";
  const selectedStationName = isEditing
    ? editingEntry.gridSubstation
    : selectedStation?.name ?? "";
  const activeDistanceToGssKm = isEditing
    ? editingEntry.distanceToGssKm
    : distanceToStationKm;
  const distanceValue =
    typeof activeDistanceToGssKm === "number"
      ? activeDistanceToGssKm.toFixed(2)
      : "";
  const showRoadWidth = formValues.accessibility === "Available";
  const showSellPrice = formValues.transactionMethod === "Sell";
  const showLeaseValue = formValues.transactionMethod === "Lease";
  const canSubmitEntry =
    isEditing || (selectedLocation !== null && selectedStation !== null);
  const hasHydrated = React.useSyncExternalStore(
    React.useCallback(() => () => undefined, []),
    () => true,
    () => false
  );
  const isSubmitDisabled = hasHydrated ? !canSubmitEntry : false;

  function updateField(
    field: keyof SiteEntryFormValues,
    value: string
  ) {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
  }

  function handleAccessibilityChange(value: string) {
    setFormValues((currentValues) => ({
      ...currentValues,
      accessibility: value,
      roadWidthFt:
        value === "Available" ? currentValues.roadWidthFt : "",
    }));
  }

  function handleTransactionMethodChange(value: string) {
    setFormValues((currentValues) => ({
      ...currentValues,
      transactionMethod: value,
      expectedPricePerPerchRs:
        value === "Sell" ? currentValues.expectedPricePerPerchRs : "",
      leaseValuePerPerchPerMonthRs:
        value === "Lease"
          ? currentValues.leaseValuePerPerchPerMonthRs
          : "",
    }));
  }

  function handleClearForm() {
    setFormValues(emptySiteEntryFormValues);
  }

  function handleCancelEdit() {
    handleClearForm();
    onCancelEdit();
  }

  function handleSubmitEntry() {
    if (!canSubmitEntry) {
      return;
    }

    const entry: SiteEntry = {
      id: editingEntry?.id ?? nextEntryId,
      coordinates: coordinatesValue,
      gridSubstation: selectedStationName,
      distanceToGssKm:
        typeof activeDistanceToGssKm === "number" ? activeDistanceToGssKm : null,
      ...formValues,
    };

    if (isEditing) {
      onUpdateEntry(entry);
    } else {
      onAddEntry(entry);
    }

    handleClearForm();
  }

  return (
    <Card id="site-details-panel" className="border-l-4 border-l-green-600">
      <CardContent className="space-y-5 p-4">
        <h2 className="font-semibold">4. Site Details</h2>

        <div className="grid gap-4 lg:grid-cols-4">
          <Field label="Site Name" required>
            <Input
              value={formValues.siteName}
              onChange={(event) => updateField("siteName", event.target.value)}
              placeholder="Enter site name"
            />
          </Field>

          <Field label="Coordinates of the Identified Land">
            <Input
              value={coordinatesValue}
              readOnly
              className="bg-muted/40"
            />
          </Field>

          <Field label="Selected Grid Substation">
            <Input
              value={selectedStationName}
              readOnly
              className="bg-muted/40"
            />
          </Field>

          <Field label="Distance to GSS (Kms)">
            <Input
              value={distanceValue}
              readOnly
              className="bg-muted/40"
            />
          </Field>

          <Field label="Extent Available (in Acres)" required>
            <Input
              value={formValues.extentAvailableAcres}
              onChange={(event) =>
                updateField("extentAvailableAcres", event.target.value)
              }
              placeholder="Enter extent in acres"
            />
          </Field>

          <Field label="Distance to 33 KVA Line (Kms)" required>
            <Input
              value={formValues.distanceTo33KvaLineKm}
              onChange={(event) =>
                updateField("distanceTo33KvaLineKm", event.target.value)
              }
              placeholder="Enter distance in km"
            />
          </Field>

          <Field label="Accessibility" required>
            <Select
              value={formValues.accessibility}
              onValueChange={handleAccessibilityChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select accessibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Not Available">Not Available</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          {showRoadWidth && (
            <Field label="Road Width (Ft)" required>
              <Input
                value={formValues.roadWidthFt}
                onChange={(event) =>
                  updateField("roadWidthFt", event.target.value)
                }
                placeholder="Enter road width in feet"
              />
            </Field>
          )}

          <Field label="D.S. Division" required>
            <Input
              value={formValues.dsDivision}
              onChange={(event) =>
                updateField("dsDivision", event.target.value)
              }
              placeholder="Enter D.S. Division"
            />
          </Field>

          <Field label="G.N. Division" required>
            <Input
              value={formValues.gnDivision}
              onChange={(event) =>
                updateField("gnDivision", event.target.value)
              }
              placeholder="Enter G.N. Division"
            />
          </Field>

          <Field label="Terrain" required>
            <Select
              value={formValues.terrain}
              onValueChange={(value) => updateField("terrain", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select terrain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Flat">Flat</SelectItem>
                <SelectItem value="Undulating">Undulating</SelectItem>
                <SelectItem value="Sloping">Sloping</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field label="Susceptibility to Flood" required>
            <Select
              value={formValues.susceptibleToFlood}
              onValueChange={(value) =>
                updateField("susceptibleToFlood", value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Yes / No" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field label="Type of the Land Ownership" required>
            <Select
              value={formValues.landOwnershipType}
              onValueChange={(value) =>
                updateField("landOwnershipType", value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select ownership type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Private">Private</SelectItem>
                <SelectItem value="Government">Government</SelectItem>
                <SelectItem value="State Corporation">State Corporation</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field label="Availability of Registration Deed" required>
            <Select
              value={formValues.registrationDeedAvailable}
              onValueChange={(value) =>
                updateField("registrationDeedAvailable", value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Yes / No" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field label="Availability of Approved Plan" required>
            <Select
              value={formValues.approvedPlanAvailable}
              onValueChange={(value) =>
                updateField("approvedPlanAvailable", value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Yes / No" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field label="Method of Transaction" required>
            <Select
              value={formValues.transactionMethod}
              onValueChange={handleTransactionMethodChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Lease">Lease</SelectItem>
                <SelectItem value="Sell">Sell</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          {showSellPrice && (
            <Field label="Expected Price of a Perch (Rs)" required>
              <Input
                value={formValues.expectedPricePerPerchRs}
                onChange={(event) =>
                  updateField("expectedPricePerPerchRs", event.target.value)
                }
                placeholder="Enter expected price in Rs."
              />
            </Field>
          )}

          {showLeaseValue && (
            <Field label="Approx. Value of Perch per Month (Rs)" required>
              <Input
                value={formValues.leaseValuePerPerchPerMonthRs}
                onChange={(event) =>
                  updateField(
                    "leaseValuePerPerchPerMonthRs",
                    event.target.value
                  )
                }
                placeholder="Enter monthly perch value in Rs."
              />
            </Field>
          )}

          <Field label="Name of the Owner / Contact Person" required>
            <Input
              value={formValues.ownerContactPerson}
              onChange={(event) =>
                updateField("ownerContactPerson", event.target.value)
              }
              placeholder="Enter owner / contact person"
            />
          </Field>

          <Field label="Contact Number" required>
            <Input
              value={formValues.contactNumber}
              onChange={(event) =>
                updateField("contactNumber", event.target.value)
              }
              placeholder="Enter contact number"
            />
          </Field>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Field label="Present Land Use (describe briefly)" required>
            <Textarea
              value={formValues.presentLandUse}
              onChange={(event) =>
                updateField("presentLandUse", event.target.value)
              }
              placeholder="Describe the present land use"
            />
          </Field>

          <Field label="Surrounding Land Use / Land Cover" required>
            <Textarea
              value={formValues.surroundingLandUse}
              onChange={(event) =>
                updateField("surroundingLandUse", event.target.value)
              }
              placeholder="Describe surrounding land use / land cover"
            />
          </Field>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Field label="Inspected by (Name)" required>
            <Input
              value={formValues.inspectedBy}
              onChange={(event) =>
                updateField("inspectedBy", event.target.value)
              }
              placeholder="Enter inspector name"
            />
          </Field>

          <Field label="Inspector Contact" required>
            <Input
              value={formValues.inspectorContact}
              onChange={(event) =>
                updateField("inspectorContact", event.target.value)
              }
              placeholder="Enter inspector contact"
            />
          </Field>
        </div>

        <div className="flex flex-col justify-end gap-3 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={isEditing ? handleCancelEdit : handleClearForm}
          >
            <Trash2 className="mr-2 size-4" />
            {isEditing ? "Cancel Edit" : "Clear Form"}
          </Button>

          <Button
            type="button"
            className="w-full bg-green-600 hover:bg-green-700 sm:w-auto"
            disabled={isSubmitDisabled}
            onClick={handleSubmitEntry}
          >
            {isEditing ? (
              <Check className="mr-1 size-4" />
            ) : (
              <Plus className="mr-1 size-4" />
            )}
            {isEditing ? "Save Changes" : "Add Entry"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  required,
  children,
}: Readonly<{
  label: string;
  required?: boolean;
  children: React.ReactNode;
}>) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
