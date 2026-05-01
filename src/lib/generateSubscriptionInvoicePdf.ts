import { PDFDocument, rgb, StandardFonts, RGB } from "pdf-lib";

export interface SubscriptionInvoiceData {
    invoiceNumber: string;
    issuedAt: Date;
    plan: "MONTHLY" | "YEARLY";
    pricing: "RECOMMENDED" | "ENTERPRISE";
    amount: number;
    startDate: Date;
    endDate: Date;
    vendor: {
        name: string;
        email: string;
    };
}

// ── colour palette ─────────────────────────────────────────────────────────
const C = {
    black:      rgb(0.08, 0.08, 0.08),
    accent:     rgb(0.086, 0.639, 0.290), // #16a34a — green-600
    accentBg:   rgb(0.902, 0.973, 0.914),// #f0fdf4 — green-50
    textMuted:  rgb(0.45, 0.45, 0.50),
    border:     rgb(0.88, 0.88, 0.90),
    white:      rgb(1, 1, 1),
};

// ── helpers ────────────────────────────────────────────────────────────────
const safe = (s: string | undefined | null) =>
    String(s ?? "").replace(/[^\x00-\x7F]/g, "");

const fmtDate = (d: Date) =>
    d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

const fmtAmount = (n: number) =>
    "Rs. " + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const numberToWords = (num: number): string => {
    const ones  = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine"];
    const teens = ["Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
    const tens  = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
    if (num === 0) return "Zero";
    const seg = (n: number): string => {
        if (n < 10)  return ones[n];
        if (n < 20)  return teens[n - 10];
        return (tens[Math.floor(n / 10)] + " " + ones[n % 10]).trim();
    };
    let w = "";
    const cr = Math.floor(num / 10_000_000);
    const lk = Math.floor((num % 10_000_000) / 100_000);
    const th = Math.floor((num % 100_000) / 1_000);
    const hu = Math.floor((num % 1_000) / 100);
    const re = Math.floor(num % 100);
    if (cr > 0) w += seg(cr) + " Crore ";
    if (lk > 0) w += seg(lk) + " Lakh ";
    if (th > 0) w += seg(th) + " Thousand ";
    if (hu > 0) w += ones[hu] + " Hundred ";
    if (re > 0) w += seg(re);
    return w.trim();
};

// ── main export ────────────────────────────────────────────────────────────
export async function generateSubscriptionInvoicePdf(
    data: SubscriptionInvoiceData,
): Promise<Buffer> {
    const pdfDoc  = await PDFDocument.create();
    const page    = pdfDoc.addPage([595.28, 841.89]); // A4
    const { width, height } = page.getSize();

    const font     = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Shorthand draw helpers
    const text = (
        t: string,
        x: number,
        y: number,
        size: number,
        f: typeof font = font,
        color: RGB = C.black,
    ) => page.drawText(safe(t), { x, y, size, font: f, color });

    const line = (x1: number, y1: number, x2: number, y2: number, color: RGB = C.border, thickness = 0.75) =>
        page.drawLine({ start: { x: x1, y: y1 }, end: { x: x2, y: y2 }, thickness, color });

    const rect = (x: number, y: number, w: number, h: number, fillColor?: RGB, borderColor?: RGB) =>
        page.drawRectangle({
            x, y, width: w, height: h,
            ...(fillColor   ? { color: fillColor }             : {}),
            ...(borderColor ? { borderColor, borderWidth: 0.75 } : {}),
        });

    const M  = 48;          // outer margin
    const W  = width - 2 * M; // content width
    let y    = height - M;

    // ── accent header bar ──────────────────────────────────────────────────
    rect(0, height - 54, width, 54, C.accent);

    // App name (white, left)
    text("Resumify", M, height - 36, 18, fontBold, C.white);
    text("AI Resume Builder", M, height - 50, 8, font, rgb(0.60, 0.91, 0.67));

    // TAX INVOICE label (white, right)
    text("TAX INVOICE", width - M - 82, height - 33, 11, fontBold, C.white);
    text("ORIGINAL FOR RECIPIENT", width - M - 106, height - 47, 7, font, rgb(0.60, 0.91, 0.67));

    y = height - 54 - 28;

    // ── invoice meta row ───────────────────────────────────────────────────
    // Left: Invoice #
    text("Invoice Number", M, y, 7, font, C.textMuted);
    text(safe(data.invoiceNumber), M, y - 13, 9, fontBold, C.black);

    // Centre: Invoice Date
    const cx = M + W / 3;
    text("Invoice Date", cx, y, 7, font, C.textMuted);
    text(fmtDate(data.issuedAt), cx, y - 13, 9, font, C.black);

    // Right: Due Date
    const rx = M + (W / 3) * 2;
    const due = new Date(data.issuedAt);
    due.setDate(due.getDate() + 5);
    text("Due Date", rx, y, 7, font, C.textMuted);
    text(fmtDate(due), rx, y - 13, 9, font, C.black);

    y -= 34;
    line(M, y, M + W, y);
    y -= 22;

    // ── two-column: billed by / billed to ─────────────────────────────────
    const col2X = M + W / 2 + 10;

    text("BILLED BY", M, y, 7, fontBold, C.accent);
    y -= 14;
    text("Resumify", M, y, 10, fontBold, C.black);
    y -= 13;
    text("mohammadarmaan.projects@gmail.com", M, y, 8, font, C.textMuted);
    y -= 11;
    text("https://resumify-project.vercel.app", M, y, 8, font, C.textMuted);

    const billedToY = y + 13 + 11 + 13 + 14; // reset to same top
    text("BILLED TO", col2X, billedToY, 7, fontBold, C.accent);
    text(safe(data.vendor.name),  col2X, billedToY - 14, 10, fontBold, C.black);
    text(safe(data.vendor.email), col2X, billedToY - 27, 8,  font,     C.textMuted);

    y -= 22;
    line(M, y, M + W, y);
    y -= 24;

    // ── service table ──────────────────────────────────────────────────────
    const colW = { num: 24, desc: 200, period: 170, amount: W - 24 - 200 - 170 };
    const xNum    = M;
    const xDesc   = M + colW.num;
    const xPeriod = xDesc + colW.desc;
    const xAmt    = xPeriod + colW.period;

    // Header background
    rect(M, y - 20, W, 24, C.accentBg);

    const hY = y - 13;
    text("#",                   xNum + 4,   hY, 8, fontBold, C.accent);
    text("Description",         xDesc,      hY, 8, fontBold, C.accent);
    text("Subscription Period", xPeriod,    hY, 8, fontBold, C.accent);
    text("Amount",              xAmt,       hY, 8, fontBold, C.accent);

    y -= 24;
    line(M, y, M + W, y, C.border);
    y -= 20;

    // Row 1
    const planLabel   = data.plan === "MONTHLY" ? "Monthly Subscription" : "Yearly Subscription";
    const pricingLabel = data.pricing === "ENTERPRISE" ? "Enterprise" : "Recommended";
    text("1",         xNum + 4, y, 9, font,     C.black);
    text(planLabel,   xDesc,    y, 9, fontBold,  C.black);

    // Pricing tier pill — drawn inline after the plan label
    const planLabelW = fontBold.widthOfTextAtSize(planLabel, 9);
    const pillX = xDesc + planLabelW + 6;
    const pillW = fontBold.widthOfTextAtSize(pricingLabel, 6.5) + 10;
    rect(pillX, y - 3, pillW, 12, C.accentBg, C.accent);
    text(pricingLabel, pillX + 5, y + 1, 6.5, fontBold, C.accent);

    text("AI-powered resume builder, unlimited exports,", xDesc, y - 13, 7, font, C.textMuted);
    text("ATS optimisation & cover letter generator.",    xDesc, y - 23, 7, font, C.textMuted);

    const period = `${fmtDate(data.startDate)} – ${fmtDate(data.endDate)}`;
    text(period,        xPeriod,   y, 8, font,     C.textMuted);
    text(fmtAmount(data.amount), xAmt, y, 9, fontBold, C.black);

    y -= 36;
    line(M, y, M + W, y, C.border);

    // ── totals block ───────────────────────────────────────────────────────
    y -= 16;

    const tX = M + W - 190;
    const tW = 190;

    // Subtotal row
    text("Subtotal", tX, y, 8, font, C.textMuted);
    text(fmtAmount(data.amount), tX + 100, y, 8, font, C.black);
    y -= 14;

    text("Tax (0%)", tX, y, 8, font, C.textMuted);
    text("Rs. 0.00", tX + 100, y, 8, font, C.black);
    y -= 4;

    line(tX, y, tX + tW, y, C.border);
    y -= 4;

    // Total highlight row
    rect(tX - 8, y - 18, tW + 8, 24, C.accentBg);
    text("Total",          tX,       y - 11, 9, fontBold, C.accent);
    text(fmtAmount(data.amount), tX + 100, y - 11, 9, fontBold, C.accent);

    y -= 30;

    // ── amount in words ────────────────────────────────────────────────────
    const words = numberToWords(Math.floor(data.amount));
    text(`Amount in words: INR ${words} Rupees Only`, M, y, 7.5, font, C.textMuted);

    // ── status pill ────────────────────────────────────────────────────────
    y -= 22;
    rect(M, y - 6, 138, 18, C.accentBg, C.accent);
    text("SUBSCRIPTION ACTIVE", M + 10, y + 4, 7, fontBold, C.accent);

    // ── footer ─────────────────────────────────────────────────────────────
    const fY = M + 38;
    line(M, fY + 14, M + W, fY + 14, C.border);

    text("This is a computer-generated document and does not require a signature.", M, fY, 7, font, C.textMuted);
    text("For queries, contact mohammadarmaan.projects@gmail.com", M, fY - 12, 7, font, C.textMuted);

    text("Resumify", M + W - 130, fY, 7, fontBold, C.black);
    text("Authorised Signatory",  M + W - 130, fY - 12, 7, font, C.textMuted);

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
}