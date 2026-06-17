"use client";

import * as React from "react";
import { Download, Eye, Pencil, Trash2, Upload } from "lucide-react";
import * as XLSX from "xlsx";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  excelRowToSiteEntry,
  siteEntryExcelHeaders,
  siteEntryToExcelRow,
  type SiteEntry,
} from "@/lib/siteEntries";

type DataSetPanelProps = {
  entries: SiteEntry[];
  onClearEntries: () => void;
  onEditEntry: (entry: SiteEntry) => void;
  onDeleteEntry: (entryId: number) => void;
  onImportEntries: (entries: SiteEntry[]) => void;
};

export default function DataSetPanel({
  entries,
  onClearEntries,
  onEditEntry,
  onDeleteEntry,
  onImportEntries,
}: Readonly<DataSetPanelProps>) {
  const [entryToDelete, setEntryToDelete] = React.useState<SiteEntry | null>(
    null
  );
  const [uploadMessage, setUploadMessage] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  function handleDownloadXlsx() {
    const workbook = XLSX.utils.book_new();
    const headers = [...siteEntryExcelHeaders];
    const worksheet = XLSX.utils.aoa_to_sheet([headers]);

    XLSX.utils.sheet_add_json(
      worksheet,
      entries.map(siteEntryToExcelRow),
      {
        header: headers,
        origin: "A2",
        skipHeader: true,
      }
    );

    worksheet["!cols"] = siteEntryExcelHeaders.map((header) => ({
      wch: Math.max(header.length + 2, 14),
    }));

    XLSX.utils.book_append_sheet(workbook, worksheet, "Site Details");
    XLSX.writeFile(workbook, "bess-site-details.xlsx");
  }

  async function handleUploadXlsx(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
      const firstSheetName = workbook.SheetNames[0];

      if (!firstSheetName) {
        setUploadMessage("No worksheet found in the selected file.");
        return;
      }

      const worksheet = workbook.Sheets[firstSheetName];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
        worksheet,
        {
          defval: null,
        }
      );
      const importedEntries = rows
        .map((row, index) => excelRowToSiteEntry(row, index + 1))
        .filter(hasImportableEntryContent)
        .map((entry, index) => ({
          ...entry,
          id: index + 1,
        }));

      if (importedEntries.length === 0) {
        setUploadMessage("No valid site entries found in the selected file.");
        return;
      }

      onImportEntries(importedEntries);
      setUploadMessage(
        `Imported ${importedEntries.length} entr${
          importedEntries.length === 1 ? "y" : "ies"
        } from ${file.name}.`
      );
    } catch {
      setUploadMessage("Could not import this file. Please upload a valid XLSX sheet.");
    } finally {
      event.target.value = "";
    }
  }

  function handleEditEntry(entry: SiteEntry) {
    onEditEntry(entry);
    document
      .getElementById("site-details-panel")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleConfirmDelete() {
    if (!entryToDelete) {
      return;
    }

    onDeleteEntry(entryToDelete.id);
    setEntryToDelete(null);
  }

  return (
    <Card className="border-l-4 border-l-green-600">
      <CardContent className="space-y-4 p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-semibold">5. Dataset Entries</h2>
            <p className="text-sm text-muted-foreground">
              {entries.length} entries added
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={handleUploadXlsx}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 size-4" />
              Upload XLSX
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              onClick={handleDownloadXlsx}
            >
              <Download className="mr-2 size-4" />
              Download XLSX
            </Button>

            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="col-span-2 w-full sm:col-span-1 sm:w-auto"
              disabled={entries.length === 0}
              onClick={onClearEntries}
            >
              <Trash2 className="mr-2 size-4" />
              Clear Dataset
            </Button>
          </div>
        </div>

        {uploadMessage && (
          <p className="text-sm text-muted-foreground">{uploadMessage}</p>
        )}

        <div className="rounded-lg border">
          <Table className="min-w-[760px]">
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Site Name</TableHead>
                <TableHead>GSS</TableHead>
                <TableHead>Distance</TableHead>
                <TableHead>Extent</TableHead>
                <TableHead>D.S Division</TableHead>
                <TableHead>G.N Division</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {entries.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-8 text-center text-sm text-muted-foreground"
                  >
                    Add a site detail entry to build the dataset.
                  </TableCell>
                </TableRow>
              )}

              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.id}</TableCell>
                  <TableCell className="font-medium">{entry.siteName}</TableCell>
                  <TableCell>{entry.gridSubstation}</TableCell>
                  <TableCell>
                    {typeof entry.distanceToGssKm === "number"
                      ? `${entry.distanceToGssKm.toFixed(2)} km`
                      : "--"}
                  </TableCell>
                  <TableCell>{entry.extentAvailableAcres} acres</TableCell>
                  <TableCell>{entry.dsDivision}</TableCell>
                  <TableCell>{entry.gnDivision}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="ghost" size="icon">
                        <Eye className="size-4" />
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditEntry(entry)}
                      >
                        <Pencil className="size-4" />
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setEntryToDelete(entry)}
                      >
                        <Trash2 className="size-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <Dialog
        open={entryToDelete !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEntryToDelete(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Dataset Entry?</DialogTitle>
            <DialogDescription>
              This will remove {entryToDelete?.siteName || "this entry"} from
              the dataset.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Delete Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function hasImportableEntryContent(entry: SiteEntry): boolean {
  return Object.entries(entry).some(([key, value]) => {
    if (key === "id") {
      return false;
    }

    return value !== null && String(value).trim() !== "";
  });
}
