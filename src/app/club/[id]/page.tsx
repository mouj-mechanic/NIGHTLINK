import { ClubRoom } from "@/components/club/club-room";

export default async function ClubPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ClubRoom clubId={id} />;
}
