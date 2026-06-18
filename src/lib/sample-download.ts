import { supabase } from "@/integrations/supabase/client";
import { DUMMY_COLLEGES } from "@/lib/constants";

export type LeadCtx = { rank: number; state: string; category: string };

export async function downloadSampleExcel(ctx: LeadCtx, phone: string) {
  const XLSX = await import("xlsx");
  const rows = DUMMY_COLLEGES.map((c, i) => ({
    "S.No": i + 1,
    "College Name": c.name,
    State: c.state,
    "Estd.": c.estd,
    Bond: c.bond,
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  ws["!cols"] = [{ wch: 6 }, { wch: 38 }, { wch: 16 }, { wch: 8 }, { wch: 14 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sample List");
  XLSX.writeFile(wb, "Prep2Seat_Sample_Preference_List.xlsx");

  if (phone) {
    await supabase.from("leads").insert({
      whatsapp_number: `+91${phone}`,
      air_rank: ctx.rank,
      state: ctx.state,
      category: ctx.category,
      source: "excel_download",
    });
  }
}
