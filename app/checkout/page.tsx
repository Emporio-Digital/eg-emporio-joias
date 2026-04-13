"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";

export default function Checkout() {
    const { items, total, clearCart } = useCart();

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [orderId, setOrderId] = useState<number | null>(null);

    // Snapshot do pedido
    const [savedOrder, setSavedOrder] = useState<{ items: any[], total: number, freight: number, discountPix: number, discountCoupon: number } | null>(null);

    // Dados Pessoais
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [cpf, setCpf] = useState("");
    const [whatsapp, setWhatsapp] = useState("");

    // Dados de Endereço
    const [cep, setCep] = useState("");
    const [rua, setRua] = useState("");
    const [numero, setNumero] = useState("");
    const [bairro, setBairro] = useState("");
    const [cidade, setCidade] = useState("");
    const [complemento, setComplemento] = useState("");

    // Cupom de Desconto
    const [cupomInput, setCupomInput] = useState("");
    const [descontoCupom, setDescontoCupom] = useState(0);
    const [msgCupom, setMsgCupom] = useState("");
    const [loadingCupom, setLoadingCupom] = useState(false);

    const [metodoPagamento, setMetodoPagamento] = useState("pix");
    const [freteSelecionado, setFreteSelecionado] = useState("motoboy");

    // Cálculos Atualizados
    const subtotal = total;
    const valorFrete = freteSelecionado === 'motoboy' ? 25.00 : 35.00;

    // Desconto PIX (5%)
    const valorDescontoPix = metodoPagamento === 'pix' ? subtotal * 0.05 : 0;

    // Total Final = Subtotal + Frete - Pix - Cupom
    const totalCalculado = subtotal + valorFrete - valorDescontoPix - descontoCupom;
    // Garante que não fique negativo
    const totalFinal = totalCalculado > 0 ? totalCalculado : 0;

    // =================================================================
    // NOVA VALIDAÇÃO DINÂMICA DE CUPONS (SUPABASE)
    // =================================================================
    const aplicarCupom = async () => {
        setMsgCupom("");
        setDescontoCupom(0);

        if (!cupomInput) return;

        const codigo = cupomInput.trim().toUpperCase();
        setLoadingCupom(true);

        try {
            const { data, error } = await supabase
                .from('coupons')
                .select('*')
                .eq('code', codigo)
                .eq('is_active', true)
                .single();

            if (error || !data) {
                setMsgCupom("❌ Cupom inválido, inativo ou expirado.");
                setDescontoCupom(0);
                setLoadingCupom(false);
                return;
            }

            if (subtotal < data.min_order_value) {
                setMsgCupom(`⚠️ Este cupom requer compras acima de R$ ${data.min_order_value.toFixed(2).replace('.', ',')}`);
                setDescontoCupom(0);
            } else {
                // --- TRAVA DE CPF MELHORADA (Busca em qualquer status) ---
                if (codigo === 'BEMVINDO15') {
                    if (!cpf || cpf.length < 11) {
                        setMsgCupom("⚠️ Preencha seu CPF antes de aplicar este cupom.");
                        setLoadingCupom(false);
                        return;
                    }

                    const { data: pedidosExistentes } = await supabase
                        .from('orders')
                        .select('id')
                        .eq('customer_cpf', cpf)
                        .eq('applied_coupon', 'BEMVINDO15')
                        .limit(1);

                    if (pedidosExistentes && pedidosExistentes.length > 0) {
                        setMsgCupom("❌ Este CPF já utilizou o cupom de boas-vindas.");
                        setDescontoCupom(0);
                        setLoadingCupom(false);
                        return;
                    }
                }

                setDescontoCupom(data.discount_value);
                setMsgCupom(`✅ Cupom de R$ ${data.discount_value.toFixed(2).replace('.', ',')} aplicado!`);
            }
        } catch (err) {
            setMsgCupom("❌ Erro ao comunicar com o servidor.");
        }
        setLoadingCupom(false);
    };

    async function handleFinalizarCompra() {
        const camposFaltando = [];
        if (!nome) camposFaltando.push("Nome");
        if (!email) camposFaltando.push("E-mail");
        if (!cpf) camposFaltando.push("CPF");
        if (!whatsapp) camposFaltando.push("WhatsApp");
        if (!cep) camposFaltando.push("CEP");
        if (!rua) camposFaltando.push("Rua");
        if (!numero) camposFaltando.push("Número");
        if (!bairro) camposFaltando.push("Bairro");
        if (!cidade) camposFaltando.push("Cidade");

        if (items.length === 0) {
            alert("Seu carrinho está vazio.");
            return;
        }

        if (camposFaltando.length > 0) {
            alert(`Preencha os campos: ${camposFaltando.join(", ")}`);
            return;
        }

        setLoading(true);

        try {
            // === DOUBLE CHECK DE SEGURANÇA (CUPOM) ===
            if (descontoCupom > 0 && cupomInput.trim().toUpperCase() === 'BEMVINDO15') {
                const { data: checkFinal } = await supabase
                    .from('orders')
                    .select('id')
                    .eq('customer_cpf', cpf)
                    .eq('applied_coupon', 'BEMVINDO15')
                    .limit(1);

                if (checkFinal && checkFinal.length > 0) {
                    setLoading(false);
                    setDescontoCupom(0);
                    alert("Erro: Este CPF já utilizou o cupom BEMVINDO15 anteriormente.");
                    return;
                }
            }

            // 1. BAIXA DE ESTOQUE
            for (const item of items) {
                const { data: success, error: rpcError } = await supabase
                    .rpc('decrement_stock', { product_id: item.id, quantity: item.quantity });
                if (rpcError || !success) throw new Error(`Estoque insuficiente: ${item.title}`);
            }

            const fullAddress = `${rua}, ${numero} - ${bairro}, ${cidade} - CEP: ${cep} ${complemento ? `(${complemento})` : ''}`;

            // 2. CRIA O PEDIDO (Incluindo applied_coupon e payment_status)
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .insert([
                    {
                        customer_name: nome,
                        customer_email: email,
                        customer_phone: whatsapp,
                        customer_cpf: cpf,
                        total_amount: totalFinal,
                        status: 'pending',
                        payment_status: 'pending',
                        applied_coupon: descontoCupom > 0 ? cupomInput.trim().toUpperCase() : null,
                        payment_method: metodoPagamento,
                        shipping_method: freteSelecionado,
                        items: items,
                        address_full: fullAddress,
                        address_zip: cep,
                        address_street: rua,
                        address_number: numero,
                        address_neighborhood: bairro,
                        address_city: cidade,
                        address_complement: complemento,
                        address_state: ""
                    }
                ])
                .select()
                .single();

            if (orderError) throw new Error("Erro de Banco: " + orderError.message);

            setOrderId(orderData.id);
            setSavedOrder({
                items: [...items],
                total: totalFinal,
                freight: valorFrete,
                discountPix: valorDescontoPix,
                discountCoupon: descontoCupom
            });

            // 3. MERCADO PAGO
            if (metodoPagamento === "cartao") {
                const itemsParaMercadoPago = [{
                    id: `ORDER-${orderData.id}`,
                    title: `Pedido #${orderData.id} - EG Empório`,
                    quantity: 1,
                    unit_price: Number(totalFinal.toFixed(2)),
                    picture_url: items[0]?.image || ""
                }];

                const response = await fetch("/api/create-preference", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        items: itemsParaMercadoPago,
                        payer: { name: nome, email: email },
                        orderId: orderData.id,
                        shippingCost: 0
                    }),
                });

                const data = await response.json();
                if (data.init_point) {
                    clearCart();
                    window.location.href = data.init_point;
                    return;
                }
            }

            clearCart();
            window.location.href = `/sucesso/${orderData.id}`;

        } catch (error: any) {
            alert("Ops! " + error.message);
            setLoading(false);
        }
        if (metodoPagamento === 'pix') setLoading(false);
    }

    // === WHATSAPP GERADOR ===
    const gerarLinkWhatsapp = () => {
        if (!orderId || !savedOrder) return "#";

        const quebra = "\n";
        const traco = "--------------------------------";

        const listaItens = savedOrder.items.map(i =>
            `- ${i.quantity}x ${i.title} ${(i as any).size ? `(Tam: ${(i as any).size})` : ''}`
        ).join(quebra);

        const fmt = (val: number) => val.toFixed(2).replace('.', ',');

        // Prepara as linhas do resumo financeiro
        const linhasFinanceiras = [
            `Subtotal: R$ ${fmt(savedOrder.total - savedOrder.freight + savedOrder.discountPix + savedOrder.discountCoupon)}`,
            `Frete: R$ ${fmt(savedOrder.freight)}`
        ];

        if (savedOrder.discountCoupon > 0) {
            linhasFinanceiras.push(`Cupom Promocional (${cupomInput}): - R$ ${fmt(savedOrder.discountCoupon)}`);
        }

        if (savedOrder.discountPix > 0) {
            linhasFinanceiras.push(`Desconto Pix (5%): - R$ ${fmt(savedOrder.discountPix)}`);
        }

        linhasFinanceiras.push(`TOTAL A PAGAR: R$ ${fmt(savedOrder.total)}`);

        const linhas = [
            `NOVO PEDIDO REALIZADO`,
            `Numero do Pedido: #${orderId}`,
            traco,
            `DADOS DO CLIENTE`,
            `Nome: ${nome}`,
            `CPF: ${cpf}`,
            traco,
            `ENTREGA`,
            `Metodo: ${freteSelecionado === 'motoboy' ? 'Motoboy Express' : 'Correios (PAC/Sedex)'}`,
            `Endereco: ${rua}, ${numero}`,
            `Bairro: ${bairro}`,
            `Cidade: ${cidade}`,
            `CEP: ${cep}`,
            complemento ? `Comp: ${complemento}` : '',
            traco,
            `ITENS DO PEDIDO`,
            listaItens,
            traco,
            `RESUMO DE VALORES`,
            ...linhasFinanceiras,
            traco,
            `Aguardo a chave Pix para pagamento.`
        ];

        const mensagem = linhas.filter(l => l !== '').join(quebra);

        return `https://wa.me/5511916053292?text=${encodeURIComponent(mensagem)}`;
    };

    if (success) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 animate-fade-in bg-neutral-950">
                <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-2xl w-full shadow-2xl text-center">

                    <div className="w-20 h-20 bg-green-900/30 text-green-400 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(74,222,128,0.2)]">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                    </div>

                    <h1 className="text-3xl font-serif font-bold text-white mb-2">Pedido Criado!</h1>
                    <p className="text-gray-400 mb-6">Obrigado, {nome}. O pedido <strong className="text-white">#{orderId}</strong> foi registrado.</p>

                    {metodoPagamento === 'pix' ? (
                        <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-6 mb-8 animate-pulse">
                            <p className="text-sm text-green-400 font-bold mb-3 uppercase tracking-wider">⚠️ Última Etapa</p>
                            <p className="text-gray-300 mb-6 text-sm">
                                Para validar os descontos e liberar o envio, envie o pedido para nosso WhatsApp agora.
                            </p>
                            <a
                                href={gerarLinkWhatsapp()}
                                target="_blank"
                                className="inline-flex items-center gap-3 bg-green-600 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-green-500 transition-all shadow-lg hover:-translate-y-1 w-full md:w-auto justify-center"
                            >
                                Confirmar no WhatsApp
                            </a>
                        </div>
                    ) : (
                        <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6 mb-8">
                            <p className="text-sm text-blue-400 font-bold mb-2">Pagamento Mercado Pago:</p>
                            <p className="text-xs text-gray-300">
                                Em breve você será redirecionado para concluir o pagamento com segurança.
                                <br />Se não for redirecionado, verifique seu e-mail: <strong className="text-white">{email}</strong>.
                            </p>
                        </div>
                    )}

                    {/* === MARKETING EG EMPÓRIO DIGITAL === */}
                    <div className="relative overflow-hidden rounded-2xl bg-black border border-white/10 p-6 shadow-2xl mt-8 group cursor-default text-left">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-[50px] group-hover:bg-blue-600/30 transition-all duration-500"></div>

                        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4">
                            <div className="flex-1">
                                <h3 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Parceiro Oficial</h3>
                                <h2 className="text-lg font-serif text-white mb-2 leading-tight">Gostou da experiência desta loja?</h2>
                                <p className="text-gray-400 text-xs mb-4 leading-relaxed">
                                    A <strong className="text-white">EG Empório Digital</strong> desenvolve e-commerces de luxo, landing pages e sistemas sob medida para o seu negócio.
                                </p>
                                <a
                                    href="https://egemporiodigital.com.br"
                                    target="_blank"
                                    className="inline-flex items-center gap-2 text-xs font-bold text-white border border-white/20 px-4 py-2 rounded-lg hover:bg-white hover:text-black transition-all transform hover:-translate-y-1"
                                >
                                    Conhecer a Agência
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                    </svg>
                                </a>
                            </div>
                            <div className="hidden sm:block text-5xl opacity-30 grayscale group-hover:grayscale-0 transition-all duration-500">
                                🚀
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <Link href="/" className="text-sm text-gray-500 hover:text-white underline">
                            Voltar para a Loja
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // === FORMULÁRIO ===
    return (
        <div className="w-full min-h-screen pt-6 pb-20 px-4 flex justify-center bg-neutral-950 overflow-x-hidden relative">
            <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-8">

                {/* === COLUNA ESQUERDA: DADOS === */}
                <div className="flex-1 flex flex-col gap-6">

                    {/* 1. Identificação */}
                    <section className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-sm animate-fade-in">
                        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                            <div className="bg-yellow-900/40 text-yellow-500 border border-yellow-500/20 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">1</div>
                            <h2 className="text-lg font-serif font-bold text-white">Dados Pessoais</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" placeholder="Nome Completo *" className="input-padrao" value={nome} onChange={e => setNome(e.target.value)} />
                            <input type="email" placeholder="E-mail *" className="input-padrao" value={email} onChange={e => setEmail(e.target.value)} />
                            <input type="text" placeholder="CPF *" className="input-padrao" value={cpf} onChange={e => setCpf(e.target.value)} />
                            <input type="tel" placeholder="WhatsApp *" className="input-padrao" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} />
                        </div>
                    </section>

                    {/* 2. Entrega */}
                    <section className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-sm animate-fade-in">
                        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                            <div className="bg-yellow-900/40 text-yellow-500 border border-yellow-500/20 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">2</div>
                            <h2 className="text-lg font-serif font-bold text-white">Endereço de Entrega</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <input
                                type="text" placeholder="CEP *" className="input-padrao md:col-span-1"
                                value={cep} onChange={e => setCep(e.target.value)}
                            />
                            <div className="flex items-center text-xs text-yellow-500 font-bold cursor-pointer hover:underline">
                                Não sei meu CEP
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <input type="text" placeholder="Rua / Avenida *" className="input-padrao w-full" value={rua} onChange={e => setRua(e.target.value)} />
                            <input type="text" placeholder="Número *" className="input-padrao w-full" value={numero} onChange={e => setNumero(e.target.value)} />
                            <input type="text" placeholder="Bairro *" className="input-padrao w-full" value={bairro} onChange={e => setBairro(e.target.value)} />
                            <input type="text" placeholder="Cidade *" className="input-padrao w-full" value={cidade} onChange={e => setCidade(e.target.value)} />
                        </div>
                        <input type="text" placeholder="Complemento (Apto, Bloco...)" className="input-padrao w-full" value={complemento} onChange={e => setComplemento(e.target.value)} />

                        {/* Opções de Frete */}
                        <div className="mt-6 flex flex-col gap-3">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Método de Envio</h3>

                            <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${freteSelecionado === 'motoboy' ? 'border-yellow-500 bg-yellow-900/20' : 'border-white/10 hover:border-yellow-500/50 bg-black/20'}`}>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="frete"
                                        checked={freteSelecionado === 'motoboy'}
                                        onChange={() => setFreteSelecionado('motoboy')}
                                        className="accent-yellow-500"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-200">Motoboy Express (SP Capital)</span>
                                        <span className="text-[10px] text-green-400 font-bold">Chega Hoje (se pedido até 14h)</span>
                                    </div>
                                </div>
                            </label>

                            <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${freteSelecionado === 'correios' ? 'border-yellow-500 bg-yellow-900/20' : 'border-white/10 hover:border-yellow-500/50 bg-black/20'}`}>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="frete"
                                        checked={freteSelecionado === 'correios'}
                                        onChange={() => setFreteSelecionado('correios')}
                                        className="accent-yellow-500"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-200">PAC / Sedex (Correios)</span>
                                        <span className="text-[10px] text-gray-500">3 a 5 dias úteis</span>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </section>

                    {/* 3. Pagamento */}
                    <section className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-sm animate-fade-in">
                        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                            <div className="bg-yellow-900/40 text-yellow-500 border border-yellow-500/20 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">3</div>
                            <div className="flex flex-col">
                                <h2 className="text-lg font-serif font-bold text-white">Pagamento</h2>
                                <span className="text-[10px] text-gray-400">Escolha como deseja pagar</span>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <button
                                onClick={() => setMetodoPagamento("pix")}
                                className={`flex-1 py-4 px-4 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 ${metodoPagamento === "pix" ? "bg-green-900/20 border-green-500 text-green-400 shadow-[0_0_10px_rgba(74,222,128,0.1)]" : "border-white/10 text-gray-400 hover:border-white/30"}`}
                            >
                                PIX via WhatsApp (5% OFF)
                            </button>
                            <button
                                onClick={() => setMetodoPagamento("cartao")}
                                className={`flex-1 py-4 px-4 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 ${metodoPagamento === "cartao" ? "bg-blue-900/20 border-blue-500 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.1)]" : "border-white/10 text-gray-400 hover:border-white/30"}`}
                            >
                                Mercado Pago (Cartão/Boleto)
                            </button>
                        </div>

                        {metodoPagamento === "pix" ? (
                            <div className="bg-green-900/10 p-6 rounded-xl border border-green-500/20 text-center animate-fade-in">
                                <p className="text-sm text-gray-300 mb-2">Finalize o pedido aqui no site.</p>
                                <p className="text-xs text-gray-500">
                                    Na próxima tela, você terá um botão para enviar o pedido ao WhatsApp e receber a chave Pix com desconto.
                                </p>
                            </div>
                        ) : (
                            <div className="bg-blue-900/10 p-6 rounded-xl border border-blue-500/20 text-center animate-fade-in">
                                <p className="text-sm text-gray-300 mb-2">Ambiente Seguro Mercado Pago</p>
                                <p className="text-xs text-gray-500">
                                    Ao clicar em "Finalizar Pedido", você será redirecionado para realizar o pagamento com segurança.
                                </p>
                            </div>
                        )}
                    </section>
                </div>

                {/* === COLUNA DIREITA: RESUMO (DARK) === */}
                <div className="w-full max-w-full lg:w-96 flex flex-col gap-6">
                    <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl sticky top-24">
                        <h3 className="text-lg font-bold text-white mb-6 font-serif tracking-wide">Resumo do Pedido</h3>

                        <div className="flex flex-col gap-4 mb-6 max-h-60 overflow-y-auto pr-2">
                            {items.map((item, idx) => (
                                <div key={`${item.id}-${idx}`} className="flex gap-3">
                                    <div className="w-16 h-16 bg-neutral-800 rounded-lg relative overflow-hidden border border-white/10 flex-shrink-0">
                                        <img src={item.image || '/placeholder.jpg'} alt="Produto" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-gray-200 line-clamp-2">{item.title}</p>
                                        <p className="text-[10px] text-gray-500">Qtd: {item.quantity}</p>
                                        {(item as any).size && (
                                            <p className="text-[10px] text-yellow-500 font-bold border border-yellow-500/30 bg-yellow-900/10 px-1 rounded w-fit mt-1">{(item as any).size}</p>
                                        )}
                                        <p className="text-xs font-bold text-white mt-1">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((item as any).sale_price || item.price)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* === ÁREA DO CUPOM (DINÂMICO) === */}
                        <div className="mb-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Possui Cupom?"
                                    className="input-padrao text-xs uppercase"
                                    value={cupomInput}
                                    onChange={(e) => setCupomInput(e.target.value)}
                                    disabled={loadingCupom || descontoCupom > 0}
                                />
                                <button
                                    onClick={aplicarCupom}
                                    disabled={loadingCupom || descontoCupom > 0}
                                    className={`text-xs font-bold px-4 rounded-xl transition-all ${descontoCupom > 0 ? 'bg-gray-600 cursor-not-allowed' : 'bg-yellow-700 hover:bg-yellow-600 text-white'}`}
                                >
                                    {loadingCupom ? '...' : (descontoCupom > 0 ? 'OK' : 'APLICAR')}
                                </button>
                            </div>
                            {msgCupom && (
                                <p className={`text-[10px] mt-1 font-bold ${msgCupom.includes("❌") ? "text-red-400" :
                                        msgCupom.includes("⚠️") ? "text-yellow-400" : "text-green-400"
                                    }`}>
                                    {msgCupom}
                                </p>
                            )}
                        </div>
                        {/* ============================== */}

                        <div className="h-[1px] bg-white/10 w-full mb-4"></div>

                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-gray-400">Subtotal</span>
                            <span className="text-xs font-bold text-gray-200">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}
                            </span>
                        </div>

                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-gray-400">Frete (Estimado)</span>
                            <span className="text-xs font-bold text-yellow-500">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorFrete)}
                            </span>
                        </div>

                        {/* Mostra o Cupom se estiver aplicado */}
                        {descontoCupom > 0 && (
                            <div className="flex justify-between items-center mb-2 text-green-400">
                                <span className="text-xs font-bold">Cupom de Desconto</span>
                                <span className="text-xs font-bold">
                                    - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(descontoCupom)}
                                </span>
                            </div>
                        )}

                        {metodoPagamento === "pix" && (
                            <div className="flex justify-between items-center mb-2 text-green-400">
                                <span className="text-xs font-bold">Desconto Pix (5%)</span>
                                <span className="text-xs font-bold">
                                    - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorDescontoPix)}
                                </span>
                            </div>
                        )}

                        <div className="h-[1px] bg-white/10 w-full my-4"></div>

                        <div className="flex justify-between items-center mb-6">
                            <span className="text-sm font-bold text-white uppercase">Total</span>
                            <span className="text-xl font-bold text-white animate-pulse">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalFinal)}
                            </span>
                        </div>

                        <button
                            onClick={() => {
                                if (items.length === 0) {
                                    alert("ERRO: Carrinho vazio.");
                                    return;
                                }
                                handleFinalizarCompra();
                            }}
                            disabled={loading}
                            className={`w-full py-4 font-bold uppercase tracking-widest text-xs rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 
                    ${loading
                                    ? "bg-gray-600 cursor-not-allowed opacity-50"
                                    : items.length === 0
                                        ? "bg-gray-700 hover:bg-gray-600 text-gray-400"
                                        : "bg-green-600 text-white hover:bg-green-500 hover:-translate-y-1 shadow-[0_0_20px_rgba(22,163,74,0.4)]"
                                }`}
                        >
                            {loading ? (
                                <span>Processando...</span>
                            ) : items.length === 0 ? (
                                <span>Carrinho Vazio</span>
                            ) : (
                                <>
                                    <span>Finalizar Pedido</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
                                    </svg>
                                </>
                            )}
                        </button>

                        <div className="mt-4 flex items-center justify-center gap-2 opacity-50 grayscale text-gray-400">
                            <span className="text-[10px]">🔒 Dados protegidos</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Estilos Globais de Input Dark */}
            <style jsx global>{`
        .input-padrao {
            width: 100%;
            background-color: rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 0.75rem;
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
            outline: none;
            transition: all 0.3s;
            color: #e5e7eb;
        }
        .input-padrao::placeholder {
            color: #6b7280;
        }
        .input-padrao:focus {
            border-color: #eab308;
            background-color: rgba(0, 0, 0, 0.6);
            box-shadow: 0 0 0 4px rgba(234, 179, 8, 0.1);
        }
      `}</style>
        </div>
    );
}