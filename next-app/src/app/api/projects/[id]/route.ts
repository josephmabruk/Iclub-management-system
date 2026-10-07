import { NextResponse } from "next/server";
import { db, delay, errorResponse, getSessionUser } from "@/app/api/_mock/db";

/** GET /api/projects/:id */
export async function GET(
  _request: Request,
  { params }: RouteContext<"/api/projects/[id]">,
) {
  if (!(await getSessionUser())) return errorResponse("Not authenticated", 401);
  const { id } = await params;
  await delay();

  const project = db.projects.find((storedProject) => storedProject.id === id);
  if (!project) return errorResponse("Project not found", 404);

  return NextResponse.json(project);
}
