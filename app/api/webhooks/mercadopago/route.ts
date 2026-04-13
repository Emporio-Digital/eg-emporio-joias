import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("data.id") || searchParams.get("id");
    const type = searchParams.get("type");

    // Só processa se for uma notificação de pagamento
    if (type === "payment" && id) {
      // 1. Consulta o Mercado Pago para saber o status real
      const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        },
      });

      const paymentData = await mpResponse.json();

      // 2. Se o pagamento estiver aprovado, atualiza o banco
      if (paymentData.status === "approved") {
        const orderId = paymentData.external_reference;

        const { error } = await supabase
          .from("orders")
          .update({ payment_status: "paid" }) // Marca como Pago
          .eq("id", orderId);

        if (error) console.error("Erro ao atualizar banco via Webhook:", error);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Erro no Webhook:", error);
    return NextResponse.json({ error: "Webhook Error" }, { status: 500 });
  }
}