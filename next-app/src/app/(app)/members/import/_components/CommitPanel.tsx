"use client";

import Link from "next/link";
import Button, { buttonStyles } from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { ROUTES } from "@/constants";
import { getErrorMessage } from "@/lib/utils";
import { useCommitImportMutation } from "@/store/api/membersApi";
import type { ImportReport, RowResolution } from "@/types";

type Props = {
  report: ImportReport;
  resolutions: Record<number, RowResolution>;
};

const CommitPanel = ({ report, resolutions }: Props) => {
  /**VARIABLES */
  const [commit, { data: result, isLoading, error }] =
    useCommitImportMutation();

  const issues = [...report.duplicates, ...report.unmatched];
  const unresolved = issues.filter((i) => !resolutions[i.rowNumber]).length;
  const decisions = Object.values(resolutions);
  const matched = decisions.filter((d) => d.action === "match_unit").length;
  const excluded = decisions.filter((d) => d.action === "exclude").length;
  const adding = report.additions.length + matched;
  const departing = report.departures.length;

  /**COMPONENT */
  if (result) {
    return (
      <Card title="Import complete">
        <p className="text-sm">
          {result.added} members added, {result.departed} marked as departing,{" "}
          {result.excluded} rows left out. Nothing was deleted.
        </p>
        <Link href={ROUTES.members} className={`${buttonStyles()} mt-4`}>
          View the member register
        </Link>
      </Card>
    );
  }

  return (
    <Card title="4. Commit">
      <div className="flex flex-col gap-4">
        <div className="rounded-lg bg-brand-50 p-4 text-sm text-brand-900">
          <p className="font-semibold">What committing will do</p>
          <ul className="mt-1 list-disc pl-5">
            <li>Add {adding} members as Active</li>
            <li>Mark {departing} members as Departing (nothing is deleted)</li>
            <li>Leave {excluded} rows out of the import</li>
          </ul>
          <p className="mt-2">
            Each change is written to the member&apos;s history.
          </p>
        </div>

        {unresolved > 0 && (
          <p role="alert" className="text-sm text-amber-800">
            Resolve the {unresolved} rows above before you can commit.
          </p>
        )}
        {error && (
          <p role="alert" className="text-sm text-red-600">
            {getErrorMessage(error)}
          </p>
        )}

        <div className="flex justify-end">
          <Button
            loading={isLoading}
            disabled={unresolved > 0}
            onClick={() => commit({ reportId: report.id, resolutions })}
          >
            Commit {adding + departing} changes
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CommitPanel;
