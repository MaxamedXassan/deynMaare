import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { phone, amount, userId } = await req.json();

    if (!phone || !amount || !userId) {
      return NextResponse.json(
        { success: false, message: "Phone, amount, and userId are required." },
        { status: 400 }
      );
    }

    // ==============================
    // ✅ FAKE PAYMENT (for testing)
    // ==============================
    console.log("💳 Fake EVC payment for:", phone);

    await new Promise((r) => setTimeout(r, 2000)); // simulate payment delay

    // update subscription in Supabase
    const newExpiry = new Date();
    newExpiry.setDate(newExpiry.getDate() + 30); // 30 days

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        is_subscribed: true,
        trial_ends_at: newExpiry.toISOString(),
      })
      .eq("id", userId);

    if (updateError) {
      console.error("DB Update Error:", updateError);
      return NextResponse.json({
        success: false,
        message: "Payment processed but subscription update failed.",
      });
    }

    return NextResponse.json({
      success: true,
      message: `Payment of $${amount} from ${phone} processed successfully.`,
      transactionId: "TXN-" + Math.floor(Math.random() * 1000000),
    });

    // =====================================
    // 💰 REAL HORMUUD API (future version)
    // =====================================
    /*
    const response = await fetch("https://api.hormuud.com/evc/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, amount }),
    });

    if (!response.ok) throw new Error("Hormuud API request failed");
    const result = await response.json();

    if (result.status === "SUCCESS") {
      await supabase.from("profiles").update({
        is_subscribed: true,
        trial_ends_at: newExpiry.toISOString(),
      }).eq("id", userId);
    }

    return NextResponse.json({
      success: result.status === "SUCCESS",
      message: result.message || "Payment complete",
      transactionId: result.transaction_id || "TXN-" + Math.floor(Math.random() * 1000000),
    });
    */
  } catch (error) {
    console.error("EVC Payment Error:", error);
    return NextResponse.json(
      { success: false, message: "Payment failed, please try again." },
      { status: 500 }
    );
  }
}
