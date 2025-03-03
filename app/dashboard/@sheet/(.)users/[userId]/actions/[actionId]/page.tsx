import { auth } from "@clerk/nextjs/server";
import { UserActionDetail } from "@/app/dashboard/users/[userId]/actions/[actionId]/user-action";
import { redirect, notFound } from "next/navigation";
import { RouterSheet } from "@/components/router-sheet";
import { Metadata } from "next";
import db from "@/db";
import * as schema from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { formatUser } from "@/lib/record-user";

export async function generateMetadata({ params }: { params: Promise<{ actionId: string }> }): Promise<Metadata> {
  const { orgId } = await auth();
  if (!orgId) {
    redirect("/");
  }

  const id = (await params).actionId;

  const userAction = await db.query.userActions.findFirst({
    where: and(eq(schema.userActions.clerkOrganizationId, orgId), eq(schema.userActions.id, id)),
    with: {
      user: true,
    },
  });

  if (!userAction) {
    return notFound();
  }

  return {
    title: `${formatUser(userAction.user)} | User action | Iffy`,
  };
}

export default async function Page({ params }: { params: Promise<{ actionId: string }> }) {
  const { orgId } = await auth();
  if (!orgId) {
    redirect("/");
  }

  const id = (await params).actionId;

  return (
    <RouterSheet title="User action">
      <UserActionDetail clerkOrganizationId={orgId} id={id} />
    </RouterSheet>
  );
}
