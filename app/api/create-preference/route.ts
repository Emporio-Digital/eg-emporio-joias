import { NextResponse } from "next/server";
import MercadoPagoConfig, { Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, payer, orderId, shippingCost } = body;

    const preference = new Preference(client);

    const mpItems = items.map((item: any) => ({
      id: item.id,
      title: item.title,
      quantity: Number(item.quantity),
      unit_price: Number(item.sale_price || item.price),
      currency_id: "BRL",
      picture_url: item.image,
    }));

    if (shippingCost > 0) {
      mpItems.push({
        id: "frete",
        title: "Custo de Envio (Frete)",
        quantity: 1,
        unit_price: Number(shippingCost),
        currency_id: "BRL",
      });
    }

    // AQUI ESTÁ O PULO DO GATO: Ele usa o NEXT_PUBLIC_BASE_URL do .env
    const result = await preference.create({
      body: {
        items: mpItems,
        payer: {
          name: payer.name,
          email: payer.email,
        },
        external_reference: orderId.toString(),
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_BASE_URL}/sucesso?order_id=${orderId}`,
          failure: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?error=failure`,
          pending: `${process.env.NEXT_PUBLIC_BASE_URL}/sucesso?order_id=${orderId}&status=pending`,
        },
        auto_return: "approved",
      },
    });

    return NextResponse.json({ init_point: result.init_point });
    
  } catch (error) {
    console.error("Erro API Mercado Pago:", error);
    return NextResponse.json({ error: "Erro ao criar preferência" }, { status: 500 });
  }
}