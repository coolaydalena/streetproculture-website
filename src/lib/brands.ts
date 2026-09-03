export type Brand = {
  id: string;
  name: string;
  category: string;
  origin: string;
  blurb: string;
  facebook: string;
  logo: string;
};

export const BRANDS: Brand[] = [
  {
    id: "cgm-italia",
    name: "CGM Italia",
    category: "Helmets",
    origin: "Italy",
    blurb:
      "Italian helmet house building road, jet and full-face lids with a focus on everyday fit and certified protection.",
    facebook: "https://www.facebook.com/share/1DZQv5isyV/?mibextid=wwXIfr",
    logo: "/images/brands/cgm-italia.png",
  },
  {
    id: "nzi-fibra",
    name: "NZI Fibra",
    category: "Helmets",
    origin: "Spain",
    blurb:
      "Fibreglass-shell helmets from NZI — light lay-ups and a heritage silhouette favoured by cafe and classic riders.",
    facebook: "https://www.facebook.com/share/1D4J5UVrrY/?mibextid=wwXIfr",
    logo: "/images/brands/nzi-fibra.png",
  },
  {
    id: "x-land",
    name: "X-land",
    category: "Cases & Luggage",
    origin: "Motorcycle Cases",
    blurb:
      "Hard cases, top boxes and mounting hardware built for touring loads and daily commuting security.",
    facebook: "https://www.facebook.com/share/1J6ePybA5v/?mibextid=wwXIfr",
    logo: "/images/brands/x-land.png",
  },
  {
    id: "oz-racing",
    name: "OZ Racing",
    category: "Moto Lifestyle",
    origin: "Apparel & Accessories",
    blurb:
      "The moto-lifestyle line — tees, caps and ride-day accessories that carry the OZ Racing name off the grid.",
    facebook: "https://www.facebook.com/share/19RFepVYx1/?mibextid=wwXIfr",
    logo: "/images/brands/oz-racing.png",
  },
];
