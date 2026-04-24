import { getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const styleId = parseInt(id, 10);
    const db = getDb();

    const style = db
      .prepare(
        `SELECT s.*, u.name as user_name, u.profile_image as user_profile
         FROM styles s JOIN users u ON s.user_id = u.id
         WHERE s.id = ?`
      )
      .get(styleId);

    if (!style) {
      return Response.json({ error: "스타일을 찾을 수 없습니다." }, { status: 404 });
    }

    let liked = false;
    const user = await getCurrentUser();
    if (user) {
      const row = db
        .prepare("SELECT id FROM likes WHERE user_id = ? AND style_id = ?")
        .get(user.id, styleId);
      liked = !!row;
    }

    return Response.json({ style, liked });
  } catch (error) {
    console.error("Style detail error:", error);
    return Response.json(
      { error: "스타일 정보를 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
