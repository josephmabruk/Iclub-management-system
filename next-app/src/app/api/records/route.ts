import { NextResponse } from "next/server";
import {
  db,
  delay,
  errorResponse,
  forbid,
  getSessionRecord,
} from "@/app/api/_mock/db";
import { DOCUMENT_TYPES, RECORD_KINDS } from "@/constants";
import { looksLikeSecret } from "@/lib/validate";
import type { RecordItem, RecordView, RegisterRecordRequest } from "@/types";

/** GET /api/records: the club's items with their current custodian. Any officer or the patron may read. */
export async function GET() {
  await delay();
  const user = await getSessionRecord();
  const club = user?.club;
  if (!club) return errorResponse("Not signed in", 401);

  const members = db.members?.[club.id] ?? [];
  const current = (db.appointments?.[club.id] ?? []).filter(
    (a) => !a.endedAt && a.termName === club.term?.name,
  );

  const items: RecordView[] = (db.records?.[club.id] ?? [])
    .map((item) => {
      const office = club.positions.find((p) => p.id === item.officeId);
      const appointment = current.find((a) => a.positionId === item.officeId);
      const holder = appointment
        ? members.find((m) => m.id === appointment.memberId)
        : undefined;
      return {
        ...item,
        officeName: office?.name ?? "Unknown office",
        custodian: holder?.fullName ?? null,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
  return NextResponse.json(items);
}

/** POST /api/records: register a document, asset or account. */
export async function POST(request: Request) {
  const body = (await request.json()) as RegisterRecordRequest;
  await delay();

  const user = await getSessionRecord();
  const club = user?.club;
  if (!user || !club) return errorResponse("Not signed in", 401);
  const denied = forbid(user, "records.manage");
  if (denied) return denied;

  if (!(body.kind in RECORD_KINDS))
    return errorResponse("Choose document, asset or account", 400);

  const name = body.name?.trim();
  const location = body.location?.trim();
  const description = body.description?.trim() ?? "";
  const mark = body.mark?.trim() ?? "";
  const period = body.period?.trim() ?? "";
  if (!name || !location)
    return errorResponse("A name and a location are required", 400);
  if (
    body.kind === "document" &&
    !(body.docType && body.docType in DOCUMENT_TYPES)
  )
    return errorResponse("Choose a document type", 400);
  if (body.kind === "account" && !mark)
    return errorResponse("Enter the account handle", 400);

  const office = club.positions.find((p) => p.id === body.officeId);
  if (!office)
    return errorResponse("Choose the office that holds this item", 400);

  if ([name, location, description, mark, period].some(looksLikeSecret))
    return errorResponse(
      "This looks like a password or key. iClub never stores credentials. Record only where the item is held.",
      400,
    );

  const now = new Date().toISOString();
  const item: RecordItem = {
    id: crypto.randomUUID(),
    kind: body.kind,
    name,
    docType: body.kind === "document" ? body.docType : undefined,
    period: body.kind === "document" ? period : undefined,
    description,
    mark,
    location,
    officeId: office.id,
    state: "held",
    custodyLog: [
      {
        id: crypto.randomUUID(),
        at: now,
        by: user.name,
        fromOfficeId: null,
        toOfficeId: office.id,
        reason: `Registered to ${office.name}`,
      },
    ],
    registeredBy: user.name,
    registeredAt: now,
  };
  ((db.records ??= {})[club.id] ??= []).push(item);
  return NextResponse.json(item, { status: 201 });
}
