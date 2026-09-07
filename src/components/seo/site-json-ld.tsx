import { JsonLd } from "@/components/seo/json-ld";
import { SITE, SITE_URL } from "@/lib/site";

/**
 * Site-wide structured data — a physical motorcycle-gear store. Rendered once in
 * the root layout so every page carries the LocalBusiness / Organization signal
 * (local pack, "buy … Manila / Philippines").
 */
export function SiteJsonLd() {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Store", "MotorcycleRepair"],
        "@id": `${SITE_URL}/#store`,
        name: SITE.name,
        url: SITE_URL,
        image: `${SITE_URL}/opengraph-image.jpg`,
        telephone: SITE.location.phone,
        priceRange: "₱₱",
        address: {
          "@type": "PostalAddress",
          streetAddress:
            "P&R Mansion Unit 105, 1515 Sto. Sepulcro St. cor. Pres. Quirino Ave., Brgy. 682, Paco",
          addressLocality: "Manila",
          addressRegion: "Metro Manila",
          postalCode: "1007",
          addressCountry: "PH",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: SITE.location.geo.lat,
          longitude: SITE.location.geo.lng,
        },
        hasMap: SITE.location.map,
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            opens: "08:00",
            closes: "17:00",
          },
        ],
        sameAs: [SITE.social.facebook],
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#org`,
        name: SITE.name,
        url: SITE_URL,
        logo: `${SITE_URL}/icon.jpg`,
        sameAs: [SITE.social.facebook],
      },
    ],
  };

  return <JsonLd data={data} />;
}
