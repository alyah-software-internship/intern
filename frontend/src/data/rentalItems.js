import excavator from "../assets/excavator.png";
import buety from "../assets/buety.png";
import car from "../assets/car.png";
import wedding from "../assets/wedding.png";
import drone from "../assets/ariculturalDron.png";
import signup from "../assets/signup.png";
import faceMask from "../assets/faceMask.png";

const rentalItems = [
  {
    id: "rent-1",
    translationKey: "excavator",
    title: "Caterpillar 301.8 Mini Excavator",
    category: "Construction & Tools",
    vendor: "Titan Heavy Rentals",
    rating: "4.8",
    badge: "Popular",
    image: excavator,
    images: [excavator, car, drone],
    accent: "#f59e0b",
    description:
      "High performance in a compact size the Caterpillar 301.8 Mini Excavator delivers reliable power.",
    longDescription:
      "High performance in a compact size. The Caterpillar 301.8 Mini Excavator delivers power and performance in a compact size to help you work in the tightest applications. Designed with an adjustable undercarriage and a swing boom for maximum versatility.",
    specs: [
      { label: "Engine Power", value: "19.2 HP" },
      { label: "Operating Weight", value: "4,464 lbs" },
      { label: "Max Dig Depth", value: "8.4 feet" },
      { label: "Fuel Type", value: "Diesel" },
      { label: "Safety Cabin", value: "ROPS/TOPS certified" },
    ],
    deposit: 500,
    overdueFee: 75,
    cancellationWindow: "48h",
    vendorInstructions:
      "Comes with a full tank of diesel; must be returned clean and refueled. Mandatory operator certification review before pick-up.",
    vendorInfo: {
      name: "Titan Heavy Rentals",
      rating: 4.9,
      onTimePercent: "99%",
    },
    price: 250,
    location: "Chicago",
    available: true,
  },
  {
    id: "rent-2",
    translationKey: "beauty",
    title: "HydraFacial MD Elite Professional Kit",
    category: "Beauty & Wellness",
    vendor: "GlowTech Aesthetic Suppliers",
    rating: "4.9",
    badge: "Premium",
    image: buety,
    images: [buety, signup, faceMask],
    accent: "#2563eb",
    description:
      "The premier aesthetic skincare system preferred by medical spas worldwide.",
    longDescription:
      "A complete professional-grade skincare delivery system providing multi-step treatment capability for hydradermabrasion, extractions, and targeted serums. Compact and reliable for busy clinics and mobile spas, the MD Elite offers precise control and consistent, reproducible results.",
    specs: [
      {
        label: "Treatment Modes",
        value: "Hydradermabrasion, Extraction, Infusion",
      },
      { label: "Power Source", value: "110-240V AC" },
      { label: "Display", value: "Digital touchscreen" },
      { label: "Accessories", value: "Multiple serums, handpieces" },
      { label: "Certification", value: "CE & FDA approved" },
    ],
    deposit: 250,
    overdueFee: 40,
    cancellationWindow: "24h",
    vendorInstructions:
      "Includes full consumables package and hygiene kit. Operator should follow manufacturer maintenance protocol and clean tips after each use.",
    vendorInfo: {
      name: "GlowTech Aesthetic Suppliers",
      rating: 4.9,
      onTimePercent: "97%",
    },
    price: 120,
    location: "New York",
    available: true,
  },
  {
    id: "rent-3",
    translationKey: "tractor",
    title: "John Deere 1025R Sub-Compact Tractor",
    category: "Agriculture & Tractors",
    vendor: "GreenField Agri Services",
    rating: "4.7",
    badge: "Verified",
    image: car,
    images: [car, drone, excavator],
    accent: "#10b981",
    description:
      "The ultimate utility tractor for landowners, small farms, and landscape projects.",
    longDescription:
      "Rugged and versatile, the John Deere 1025R offers a compact footprint with a powerful diesel engine and multiple attachments for mowing, tilling, and transport. Built for reliability and ease of maintenance, suitable for acreage, hobby farms, and landscape contractors.",
    specs: [
      { label: "Engine", value: "24.2 HP diesel" },
      { label: "Hydraulics", value: "2,400 PSI" },
      { label: "Attachments", value: "Loader, mower, tiller" },
      { label: "Transmission", value: "Hydrostatic" },
      { label: "Fuel Capacity", value: "11.9 gal" },
    ],
    deposit: 350,
    overdueFee: 55,
    cancellationWindow: "48h",
    vendorInstructions:
      "Return the tractor washed and with a full fuel tank. Attachments should be cleaned and stored safely.",
    vendorInfo: {
      name: "GreenField Agri Services",
      rating: 4.7,
      onTimePercent: "95%",
    },
    price: 180,
    location: "Dallas",
    available: true,
  },
  {
    id: "rent-4",
    translationKey: "wedding",
    title: "Premium Wedding Sound System",
    category: "Event Management",
    vendor: "SoundVibe Event Gear",
    rating: "4.6",
    badge: "Fast Escrow",
    image: wedding,
    images: [wedding, car, buety],
    accent: "#8b5cf6",
    description:
      "Elegant sound and lighting equipment for unforgettable weddings and special events.",
    longDescription:
      "A modular, high-fidelity wedding sound package engineered for clarity and power. Includes mixer, amplified speakers, wired and wireless microphones, and stage monitors. Quick to deploy and tuned for speech and music in small-to-medium venues.",
    specs: [
      { label: "Speaker Output", value: "2 x 1500W" },
      { label: "Microphones", value: "2 wireless + 1 wired" },
      { label: "Lighting", value: "LED uplights + moving heads" },
      { label: "Setup Time", value: "30 minutes" },
      { label: "Coverage", value: "Up to 500 guests" },
    ],
    deposit: 450,
    overdueFee: 65,
    cancellationWindow: "72h",
    vendorInstructions:
      "Vendor will deliver, set up, and test all equipment. Please provide venue access and power details in advance.",
    vendorInfo: {
      name: "SoundVibe Event Gear",
      rating: 4.6,
      onTimePercent: "92%",
    },
    price: 220,
    location: "Los Angeles",
    available: true,
  },
];

export default rentalItems;
