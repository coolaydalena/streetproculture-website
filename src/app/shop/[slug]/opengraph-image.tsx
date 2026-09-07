import { ImageResponse } from "next/og";
import { getPublishedProductBySlug } from "@/lib/products-db";
import { categoryNoun, priceRangeLabel } from "@/lib/product-seo";
import type { Product } from "@/lib/products";
import { SITE, SITE_URL } from "@/lib/site";

export const alt = "Street Pro Culture product";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPER = "#f5f5dc";
const INK = "#2b2b2b";
const COAL = "#141312";
const OXBLOOD = "#8b0000";
const GOLD = "#e3a027";

/** The product's real primary photo (absolute URL), or null when there's none. */
function primaryPhoto(product: Product | null): string | null {
  if (!product) return null;
  const images = product.images.filter(
    (i) => i.mediaType === "image" && !/\.svg(\?|$)/i.test(i.url),
  );
  const img = images.find((i) => i.isPrimary) ?? images[0];
  if (!img) return null;
  return img.url.startsWith("http") ? img.url : `${SITE_URL}${img.url}`;
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getPublishedProductBySlug(slug);
  const name = product?.name ?? SITE.name;
  const kicker = product
    ? `${product.brand ? `${product.brand} · ` : ""}${categoryNoun(product.category)}`
    : SITE.tagline;
  const price = product ? priceRangeLabel(product) : "";
  const nVariants = product?.variants.filter((v) => v.isActive).length ?? 0;
  const optionWord = product?.category === "helmets" ? "colourways" : "options";
  const photo = primaryPhoto(product);

  // --- Real product photo, with a brand + price strip along the bottom -----
  if (photo) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            position: "relative",
            background: COAL,
            fontFamily: "sans-serif",
          }}
        >
          <img
            src={photo}
            alt=""
            width={1200}
            height={630}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              flexDirection: "column",
              gap: 10,
              padding: "150px 56px 46px",
              background:
                "linear-gradient(rgba(20,19,18,0) 0%, rgba(20,19,18,0.55) 45%, rgba(20,19,18,0.95) 100%)",
              color: PAPER,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 20,
                letterSpacing: 5,
                textTransform: "uppercase",
                color: GOLD,
              }}
            >
              Street Pro Culture
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: 32,
              }}
            >
              <span
                style={{
                  fontSize: name.length > 26 ? 44 : 58,
                  fontWeight: 800,
                  lineHeight: 1.04,
                  maxWidth: 820,
                }}
              >
                {name}
              </span>
              {price && (
                <span style={{ fontSize: 42, fontWeight: 700, whiteSpace: "nowrap" }}>
                  {price}
                </span>
              )}
            </div>
          </div>
        </div>
      ),
      size,
    );
  }

  // --- No photo yet: a generated branded card ----------------------------
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: PAPER,
          color: INK,
          padding: "72px 80px",
          border: `16px solid ${OXBLOOD}`,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: OXBLOOD,
          }}
        >
          Street Pro <span style={{ color: GOLD, marginLeft: 10 }}>Culture</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#595959",
            }}
          >
            {kicker}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: name.length > 22 ? 76 : 96,
              fontWeight: 800,
              lineHeight: 1.05,
            }}
          >
            {name}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 30,
          }}
        >
          <span style={{ color: "#595959" }}>
            {nVariants > 1 ? `${nVariants} ${optionWord}` : "In stock"} · Paco, Manila
          </span>
          {price && (
            <span style={{ fontSize: 44, fontWeight: 700, color: OXBLOOD }}>
              {price}
            </span>
          )}
        </div>
      </div>
    ),
    size,
  );
}
