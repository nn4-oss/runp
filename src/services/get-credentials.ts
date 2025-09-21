import prisma from "@/lib/prisma";
import { ScopeEnum } from "generated/prisma";

export async function getOpenAIPrimaryKeys(scope: ScopeEnum, userId: string) {
  const isProScope = scope === ScopeEnum.PRO;

  if (!isProScope) return;
  return await prisma.integration.findMany({
    where: {
      service: "OPENAI",
      isPrimary: true,
      userId: userId,
    },
    include: {
      credential: true,
    },
  });
}
