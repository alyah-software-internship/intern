import constructionImage from "./excavator.png";
import beautyImage from "./buety.png";
import agricultureImage from "./ariculturalDron.png";
import vehiclesImage from "./car.png";
import rentalItemsData from "../data/rentalItems";

// dummyAssets.js - Complete Dummy Data with Amharic & English Support
// for i-Share Rental Marketplace

// Helper function to generate random IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// ---------- CATEGORIES ----------
export const categories = [
  {
    id: "cat-1",
    name: "Construction Equipment",
    nameAm: "የግንባታ መሳሪያዎች",
    icon: "🔧",
    image: constructionImage,
    accent: "#22c55e",
    description: "Heavy machinery and tools for construction",
    descriptionAm: "ለግንባታ ከባድ ማሽኖች እና መሳሪያዎች",
    count: 45,
  },
  {
    id: "cat-2",
    name: "Vehicles & Transportation",
    nameAm: "ተሽከርካሪዎች እና መጓጓዣ",
    icon: "🚗",
    image: vehiclesImage,
    accent: "#8b5cf6",
    description: "Cars, trucks, motorcycles and more",
    descriptionAm: "መኪኖች፣ የጭነት መኪኖች፣ ሞተርሳይክሎች እና ሌሎችም",
    count: 38,
  },
  {
    id: "cat-3",
    name: "Beauty & Personal Care",
    nameAm: "ውበት እና የግል እንክብካቤ",
    icon: "💄",
    image: beautyImage,
    accent: "#ec4899",
    description: "Beauty equipment and salon tools",
    descriptionAm: "የውበት መሳሪያዎች እና የሳሎን መሳሪያዎች",
    count: 22,
  },
  {
    id: "cat-4",
    name: "Agricultural Equipment",
    nameAm: "የግብርና መሳሪያዎች",
    icon: "🚜",
    image: agricultureImage,
    accent: "#10b981",
    description: "Farming machinery and tools",
    descriptionAm: "የእርሻ ማሽኖች እና መሳሪያዎች",
    count: 30,
  },
  {
    id: "cat-5",
    name: "Event & Party Supplies",
    nameAm: "የዝግጅት እና የፓርቲ ቁሳቁሶች",
    icon: "🎉",
    description: "Tents, chairs, decorations and more",
    descriptionAm: "ድንኳኖች፣ ወንበሮች፣ ጌጣጌጦች እና ሌሎችም",
    count: 25,
  },
  {
    id: "cat-6",
    name: "Electronics & Gadgets",
    nameAm: "ኤሌክትሮኒክስ እና መሳሪያዎች",
    icon: "💻",
    description: "Cameras, laptops, projectors",
    descriptionAm: "ካሜራዎች፣ ላፕቶፖች፣ ፕሮጀክተሮች",
    count: 18,
  },
  {
    id: "cat-7",
    name: "Sports & Fitness",
    nameAm: "ስፖርት እና የአካል ብቃት እንቅስቃሴ",
    icon: "⚽",
    description: "Sports equipment and gym gear",
    descriptionAm: "የስፖርት መሳሪያዎች እና የጂም መሳሪያዎች",
    count: 20,
  },
  {
    id: "cat-8",
    name: "Home & Garden",
    nameAm: "ቤት እና አትክልት",
    icon: "🏠",
    description: "Furniture, tools, and garden equipment",
    descriptionAm: "የቤት እቃዎች፣ መሳሪያዎች እና የአትክልት መሳሪያዎች",
    count: 35,
  },
];

// ---------- VENDORS ----------
export const vendors = [
  {
    id: "vend-1",
    name: "Addis Construction PLC",
    nameAm: "አዲስ ኮንስትራክሽን ኃላ",
    email: "info@addisconstruction.com",
    phone: "+251-911-234-567",
    address: "123 iShare Plaza, Addis Ababa, Ethiopia",
    addressAm: "123 አይሸር ፕላዛ፣ አዲስ አበባ፣ ኢትዮጵያ",
    rating: 4.8,
    totalReviews: 156,
    joinedDate: "2023-01-15",
    subscription: "premium",
    businessType: "Construction Company",
    businessTypeAm: "የግንባታ ኩባንያ",
    logo: "https://ui-avatars.com/api/?name=Addis+Construction&size=100&background=F97316&color=fff",
    description: "Leading construction equipment provider in Ethiopia",
    descriptionAm: "በኢትዮጵያ ውስጥ መሪ የግንባታ መሣሪያ አቅራቢ",
    verified: true,
  },
  {
    id: "vend-2",
    name: "Express Car Rental",
    nameAm: "ኤክስፕረስ መኪና ኪራይ",
    email: "info@expresscarrental.com",
    phone: "+251-922-345-678",
    address: "123 iShare Plaza, Addis Ababa, Ethiopia",
    addressAm: "123 አይሸር ፕላዛ፣ አዲስ አበባ፣ ኢትዮጵያ",
    rating: 4.6,
    totalReviews: 203,
    joinedDate: "2023-03-20",
    subscription: "premium",
    businessType: "Car Rental",
    businessTypeAm: "የመኪና ኪራይ",
    logo: "https://ui-avatars.com/api/?name=Express+Car+Rental&size=100&background=F97316&color=fff",
    description: "Quality vehicles for every occasion",
    descriptionAm: "ለሁሉም ዝግጅት ጥራት ያላቸው ተሽከርካሪዎች",
    verified: true,
  },
  {
    id: "vend-3",
    name: "Beauty Pro Supplies",
    nameAm: "ቢውቲ ፕሮ አቅርቦቶች",
    email: "info@beautypro.com",
    phone: "+251-933-456-789",
    address: "123 iShare Plaza, Addis Ababa, Ethiopia",
    addressAm: "123 አይሸር ፕላዛ፣ አዲስ አበባ፣ ኢትዮጵያ",
    rating: 4.9,
    totalReviews: 89,
    joinedDate: "2023-05-10",
    subscription: "standard",
    businessType: "Beauty Equipment Supplier",
    businessTypeAm: "የውበት መሳሪያ አቅራቢ",
    logo: "https://ui-avatars.com/api/?name=Beauty+Pro&size=100&background=F97316&color=fff",
    description: "Professional beauty equipment for salons",
    descriptionAm: "ለሳሎኖች ፕሮፌሽናል የውበት መሳሪያዎች",
    verified: true,
  },
  {
    id: "vend-4",
    name: "Green Fields Agriculture",
    nameAm: "ግሪን ፊልድስ ግብርና",
    email: "info@greenfields.com",
    phone: "+251-944-567-890",
    address: "123 iShare Plaza, Addis Ababa, Ethiopia",
    addressAm: "123 አይሸር ፕላዛ፣ አዲስ አበባ፣ ኢትዮጵያ",
    rating: 4.7,
    totalReviews: 112,
    joinedDate: "2023-02-01",
    subscription: "standard",
    businessType: "Agricultural Services",
    businessTypeAm: "የግብርና አገልግሎቶች",
    logo: "https://ui-avatars.com/api/?name=Green+Fields&size=100&background=F97316&color=fff",
    description: "Modern farming solutions and equipment",
    descriptionAm: "ዘመናዊ የእርሻ መፍትሄዎች እና መሳሪያዎች",
    verified: true,
  },
  {
    id: "vend-5",
    name: "Event Masters Ethiopia",
    nameAm: "ኢቨንት ማስተርስ ኢትዮጵያ",
    email: "info@eventmasters.com",
    phone: "+251-955-678-901",
    address: "123 iShare Plaza, Addis Ababa, Ethiopia",
    addressAm: "123 አይሸር ፕላዛ፣ አዲስ አበባ፣ ኢትዮጵያ",
    rating: 4.5,
    totalReviews: 178,
    joinedDate: "2023-04-15",
    subscription: "premium",
    businessType: "Event Planning & Rentals",
    businessTypeAm: "የዝግጅት እቅድ እና ኪራይ",
    logo: "https://ui-avatars.com/api/?name=Event+Masters&size=100&background=F97316&color=fff",
    description: "Complete event solutions and rentals",
    descriptionAm: "የተሟላ የዝግጅት መፍትሄዎች እና ኪራዮች",
    verified: true,
  },
  {
    id: "vend-6",
    name: "TechGadgets Hub",
    nameAm: "ቴክ ጋጄቶች ሃብ",
    email: "info@techgadgets.com",
    phone: "+251-966-789-012",
    address: "123 iShare Plaza, Addis Ababa, Ethiopia",
    addressAm: "123 አይሸር ፕላዛ፣ አዲስ አበባ፣ ኢትዮጵያ",
    rating: 4.4,
    totalReviews: 67,
    joinedDate: "2023-06-20",
    subscription: "standard",
    businessType: "Electronics Rental",
    businessTypeAm: "የኤሌክትሮኒክስ ኪራይ",
    logo: "https://ui-avatars.com/api/?name=TechGadgets&size=100&background=F97316&color=fff",
    description: "Latest tech gadgets for rent",
    descriptionAm: "ለኪራይ የቅርብ ጊዜ የቴክኖሎጂ መሳሪያዎች",
    verified: true,
  },
  {
    id: "vend-7",
    name: "FitZone Gym Equipment",
    nameAm: "ፊት ዞን ጂም መሳሪያዎች",
    email: "info@fitzone.com",
    phone: "+251-977-890-123",
    address: "123 iShare Plaza, Addis Ababa, Ethiopia",
    addressAm: "123 አይሸር ፕላዛ፣ አዲስ አበባ፣ ኢትዮጵያ",
    rating: 4.3,
    totalReviews: 45,
    joinedDate: "2023-07-01",
    subscription: "basic",
    businessType: "Fitness Equipment Rental",
    businessTypeAm: "የአካል ብቃት መሳሪያ ኪራይ",
    logo: "https://ui-avatars.com/api/?name=FitZone&size=100&background=F97316&color=fff",
    description: "Professional gym equipment for rent",
    descriptionAm: "ለኪራይ ፕሮፌሽናል የጂም መሳሪያዎች",
    verified: true,
  },
  {
    id: "vend-8",
    name: "Home Comfort Rentals",
    nameAm: "ሆም ኮምፎርት ኪራዮች",
    email: "info@homecomfort.com",
    phone: "+251-988-901-234",
    address: "123 iShare Plaza, Addis Ababa, Ethiopia",
    addressAm: "123 አይሸር ፕላዛ፣ አዲስ አበባ፣ ኢትዮጵያ",
    rating: 4.2,
    totalReviews: 34,
    joinedDate: "2023-08-12",
    subscription: "basic",
    businessType: "Home & Garden Rentals",
    businessTypeAm: "የቤት እና የአትክልት ኪራዮች",
    logo: "https://ui-avatars.com/api/?name=Home+Comfort&size=100&background=F97316&color=fff",
    description: "Making your house a home with our rentals",
    descriptionAm: "በኪራዮቻችን ቤትዎን ቤት ማድረግ",
    verified: true,
  },
];

export const rentalItems = rentalItemsData;

export const wishlistItems = rentalItemsData.filter((item) =>
  ["rent-2", "rent-4"].includes(item.id),
);

// ---------- PRODUCTS ----------
export const products = [
  // CONSTRUCTION EQUIPMENT
  {
    id: "prod-1",
    name: "Excavator - CAT 320D",
    nameAm: "ኤክስካቫተር - ካት 320ዲ",
    description:
      "Heavy-duty excavator for construction and earthmoving projects. Perfect for large-scale construction sites.",
    descriptionAm:
      "ለግንባታ እና የመሬት ሥራ ፕሮጀክቶች ከባድ ተግባር መቆፈሪያ። ለትልቅ የግንባታ ጣቢያዎች ፍጹም ነው።",
    category: "cat-1",
    vendor: "vend-1",
    images: [
      "https://images.unsplash.com/photo-1590004953392-5abc2e475c10?w=600",
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600",
      "https://images.unsplash.com/photo-1513828583688-c52646db42da?w=600",
    ],
    pricing: {
      hourly: { amount: 250, label: "ETB 250/hour", labelAm: "250 ብር/ሰዓት" },
      daily: { amount: 1800, label: "ETB 1,800/day", labelAm: "1,800 ብር/ቀን" },
      weekly: {
        amount: 10500,
        label: "ETB 10,500/week",
        labelAm: "10,500 ብር/ሳምንት",
      },
      monthly: {
        amount: 35000,
        label: "ETB 35,000/month",
        labelAm: "35,000 ብር/ወር",
      },
    },
    availability: {
      status: "available",
      statusAm: "ይገኛል",
      availableFrom: "2026-01-15",
      availableTo: "2026-12-31",
    },
    specifications: {
      model: "CAT 320D",
      modelAm: "ካት 320ዲ",
      year: 2022,
      weight: "22.8 tons",
      weightAm: "22.8 ቶን",
      enginePower: "210 HP",
      enginePowerAm: "210 የፈረስ ጉልበት",
      operatingWeight: "22,800 kg",
      operatingWeightAm: "22,800 ኪ.ግ",
      bucketCapacity: "1.0-2.0 m³",
      bucketCapacityAm: "1.0-2.0 ሜትር³",
    },
    rentalPolicies: {
      securityDeposit: {
        amount: 5000,
        label: "ETB 5,000",
        labelAm: "5,000 ብር",
      },
      lateFee: { amount: 500, label: "ETB 500/day", labelAm: "500 ብር/ቀን" },
      cancellationPolicy: "24 hours notice required",
      cancellationPolicyAm: "ከ24 ሰዓታት በፊት ማሳወቅ ያስፈልጋል",
      damageProtection: "Insurance required",
      damageProtectionAm: "ኢንሹራንስ ያስፈልጋል",
    },
    deliveryAvailable: true,
    deliveryAvailableAm: "አዎ",
    rating: 4.9,
    totalReviews: 23,
    features: ["AC Cabin", "GPS Tracking", "LED Lights", "Advanced Hydraulics"],
    featuresAm: ["ኤሲ ካቢን", "ጂፒኤስ መከታተያ", "ኤልኢዲ መብራቶች", "የላቀ የሃይድሮሊክ ስርዓት"],
    createdAt: "2024-01-15",
  },
  {
    id: "prod-2",
    name: "Concrete Mixer - 500L",
    nameAm: "ኮንክሪት ሚክስተር - 500ሊ",
    description:
      "Portable concrete mixer ideal for medium-sized construction projects. Easy to operate and maintain.",
    descriptionAm:
      "ለመካከለኛ መጠን የግንባታ ፕሮጀክቶች ተስማሚ የሆነ ተንቀሳቃሽ ኮንክሪት ቀማሽ። ለመሥራት እና ለመጠገን ቀላል ነው።",
    category: "cat-1",
    vendor: "vend-1",
    images: [
      "https://images.unsplash.com/photo-1591632169188-9e9a2c5ee57c?w=600",
      "https://images.unsplash.com/photo-1560770476-d3c2bdd81afd?w=600",
    ],
    pricing: {
      hourly: { amount: 45, label: "ETB 45/hour", labelAm: "45 ብር/ሰዓት" },
      daily: { amount: 350, label: "ETB 350/day", labelAm: "350 ብር/ቀን" },
      weekly: {
        amount: 2000,
        label: "ETB 2,000/week",
        labelAm: "2,000 ብር/ሳምንት",
      },
      monthly: {
        amount: 6500,
        label: "ETB 6,500/month",
        labelAm: "6,500 ብር/ወር",
      },
    },
    availability: {
      status: "available",
      statusAm: "ይገኛል",
      availableFrom: "2026-01-20",
      availableTo: "2026-12-31",
    },
    specifications: {
      capacity: "500 Liters",
      capacityAm: "500 ሊትር",
      power: "5.5 HP",
      powerAm: "5.5 የፈረስ ጉልበት",
      voltage: "220V",
      voltageAm: "220 ቮልት",
      weight: "400 kg",
      weightAm: "400 ኪ.ግ",
    },
    rentalPolicies: {
      securityDeposit: {
        amount: 1000,
        label: "ETB 1,000",
        labelAm: "1,000 ብር",
      },
      lateFee: { amount: 100, label: "ETB 100/day", labelAm: "100 ብር/ቀን" },
      cancellationPolicy: "12 hours notice required",
      cancellationPolicyAm: "ከ12 ሰዓታት በፊት ማሳወቅ ያስፈልጋል",
    },
    deliveryAvailable: true,
    deliveryAvailableAm: "አዎ",
    rating: 4.7,
    totalReviews: 18,
    features: ["Portable", "Easy to Clean", "Heavy Duty"],
    featuresAm: ["ተንቀሳቃሽ", "ለማጽዳት ቀላል", "ከባድ ጭነት ተቋቋሚ"],
    createdAt: "2024-01-20",
  },
  {
    id: "prod-3",
    name: "Forklift - 3 Ton",
    nameAm: "ፎርክሊፍት - 3 ቶን",
    description:
      "Industrial forklift for warehouse and construction sites. Reliable and efficient material handling.",
    descriptionAm:
      "ለመጋዘን እና ለግንባታ ጣቢያዎች የኢንዱስትሪ ፎርክሊፍት። አስተማማኝ እና ቀልጣፋ የቁሳቁስ አያያዝ።",
    category: "cat-1",
    vendor: "vend-1",
    images: [
      "https://images.unsplash.com/photo-1563986768494-4d1e0f8b2e8a?w=600",
      "https://images.unsplash.com/photo-1582727657635-c771002bd7f6?w=600",
    ],
    pricing: {
      hourly: { amount: 80, label: "ETB 80/hour", labelAm: "80 ብር/ሰዓት" },
      daily: { amount: 600, label: "ETB 600/day", labelAm: "600 ብር/ቀን" },
      weekly: {
        amount: 3500,
        label: "ETB 3,500/week",
        labelAm: "3,500 ብር/ሳምንት",
      },
      monthly: {
        amount: 12000,
        label: "ETB 12,000/month",
        labelAm: "12,000 ብር/ወር",
      },
    },
    availability: {
      status: "available",
      statusAm: "ይገኛል",
      availableFrom: "2026-02-01",
      availableTo: "2026-12-31",
    },
    specifications: {
      capacity: "3000 kg",
      capacityAm: "3000 ኪ.ግ",
      liftHeight: "4.5m",
      liftHeightAm: "4.5 ሜትር",
      engineType: "Diesel",
      engineTypeAm: "ናፍጣ",
      fuelTank: "60 Liters",
      fuelTankAm: "60 ሊትር",
    },
    rentalPolicies: {
      securityDeposit: {
        amount: 2000,
        label: "ETB 2,000",
        labelAm: "2,000 ብር",
      },
      lateFee: { amount: 200, label: "ETB 200/day", labelAm: "200 ብር/ቀን" },
      cancellationPolicy: "24 hours notice required",
      cancellationPolicyAm: "ከ24 ሰዓታት በፊት ማሳወቅ ያስፈልጋል",
    },
    deliveryAvailable: true,
    deliveryAvailableAm: "አዎ",
    rating: 4.8,
    totalReviews: 15,
    features: ["Powerful Engine", "Smooth Operation", "Safety Features"],
    featuresAm: ["ኃይለኛ ሞተር", "ለስላሳ ክወና", "የደህንነት ባህሪዎች"],
    createdAt: "2024-02-01",
  },

  // VEHICLES
  {
    id: "prod-4",
    name: "Toyota Land Cruiser - 2024",
    nameAm: "ቶዮታ ላንድ ክሩዘር - 2024",
    description:
      "Luxury SUV perfect for family trips, business travel, or off-road adventures. Fully loaded with premium features.",
    descriptionAm:
      "ለቤተሰብ ጉዞ፣ ለንግድ ጉዞ ወይም ለጉዞ ጉዞዎች ፍጹም የሆነ የቅንጦት ኤስዩቪ። በፕሪሚየም ባህሪያት የተጫነ።",
    category: "cat-2",
    vendor: "vend-2",
    images: [
      "https://images.unsplash.com/photo-1533473359331-6b44a3ca6f54?w=600",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600",
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600",
    ],
    pricing: {
      hourly: { amount: 120, label: "ETB 120/hour", labelAm: "120 ብር/ሰዓት" },
      daily: { amount: 800, label: "ETB 800/day", labelAm: "800 ብር/ቀን" },
      weekly: {
        amount: 5000,
        label: "ETB 5,000/week",
        labelAm: "5,000 ብር/ሳምንት",
      },
      monthly: {
        amount: 18000,
        label: "ETB 18,000/month",
        labelAm: "18,000 ብር/ወር",
      },
    },
    availability: {
      status: "available",
      statusAm: "ይገኛል",
      availableFrom: "2026-01-25",
      availableTo: "2026-12-31",
    },
    specifications: {
      make: "Toyota",
      makeAm: "ቶዮታ",
      model: "Land Cruiser",
      modelAm: "ላንድ ክሩዘር",
      year: 2024,
      mileage: "15,000 km",
      mileageAm: "15,000 ኪ.ሜ",
      fuelType: "Diesel",
      fuelTypeAm: "ናፍጣ",
      transmission: "Automatic",
      transmissionAm: "አውቶማቲክ",
      seating: "7 seater",
      seatingAm: "7 መቀመጫ",
    },
    rentalPolicies: {
      securityDeposit: {
        amount: 3000,
        label: "ETB 3,000",
        labelAm: "3,000 ብር",
      },
      lateFee: { amount: 300, label: "ETB 300/day", labelAm: "300 ብር/ቀን" },
      cancellationPolicy: "48 hours notice required",
      cancellationPolicyAm: "ከ48 ሰዓታት በፊት ማሳወቅ ያስፈልጋል",
      damageProtection: "Full insurance included",
      damageProtectionAm: "ሙሉ ኢንሹራንስ ተካቷል",
    },
    deliveryAvailable: true,
    deliveryAvailableAm: "አዎ",
    rating: 4.9,
    totalReviews: 42,
    features: [
      "Leather Seats",
      "Navigation",
      "Rear Camera",
      "Climate Control",
      "Sunroof",
    ],
    featuresAm: ["የቆዳ መቀመጫ", "ናቪጌሽን", "የኋላ ካሜራ", "የአየር ንብረት መቆጣጠሪያ", "ሰንሩፍ"],
    createdAt: "2024-02-15",
  },
  {
    id: "prod-5",
    name: "Toyota Hiace Minibus - 15 Seater",
    nameAm: "ቶዮታ ሃይስ ሚኒባስ - 15 መቀመጫ",
    description:
      "Spacious minibus ideal for group tours, corporate events, and airport transfers. Comfortable seating for 15 passengers.",
    descriptionAm:
      "ለቡድን ጉዞዎች፣ ለኮርፖሬት ዝግጅቶች እና ለአየር መንገድ ማስተላለፍ ተስማሚ የሆነ ሰፊ ሚኒባስ። ለ15 መንገደኞች ምቹ መቀመጫ።",
    category: "cat-2",
    vendor: "vend-2",
    images: [
      "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=600",
      "https://images.unsplash.com/photo-1549317661-b2b6b6b5a8e8?w=600",
    ],
    pricing: {
      hourly: { amount: 150, label: "ETB 150/hour", labelAm: "150 ብር/ሰዓት" },
      daily: { amount: 1000, label: "ETB 1,000/day", labelAm: "1,000 ብር/ቀን" },
      weekly: {
        amount: 6000,
        label: "ETB 6,000/week",
        labelAm: "6,000 ብር/ሳምንት",
      },
      monthly: {
        amount: 22000,
        label: "ETB 22,000/month",
        labelAm: "22,000 ብር/ወር",
      },
    },
    availability: {
      status: "available",
      statusAm: "ይገኛል",
      availableFrom: "2026-02-01",
      availableTo: "2026-12-31",
    },
    specifications: {
      make: "Toyota",
      makeAm: "ቶዮታ",
      model: "Hiace",
      modelAm: "ሃይስ",
      year: 2023,
      mileage: "22,000 km",
      mileageAm: "22,000 ኪ.ሜ",
      fuelType: "Diesel",
      fuelTypeAm: "ናፍጣ",
      transmission: "Manual",
      transmissionAm: "በእጅ",
      seating: "15 seater",
      seatingAm: "15 መቀመጫ",
      capacity: "15 passengers",
      capacityAm: "15 መንገደኞች",
    },
    rentalPolicies: {
      securityDeposit: {
        amount: 4000,
        label: "ETB 4,000",
        labelAm: "4,000 ብር",
      },
      lateFee: { amount: 400, label: "ETB 400/day", labelAm: "400 ብር/ቀን" },
      cancellationPolicy: "48 hours notice required",
      cancellationPolicyAm: "ከ48 ሰዓታት በፊት ማሳወቅ ያስፈልጋል",
    },
    deliveryAvailable: true,
    deliveryAvailableAm: "አዎ",
    rating: 4.7,
    totalReviews: 35,
    features: ["Air Conditioning", "Sound System", "Luggage Space"],
    featuresAm: ["ኤር ኮንዲሽን", "የድምጽ ስርዓት", "የሻንጣ ቦታ"],
    createdAt: "2024-03-01",
  },
  {
    id: "prod-6",
    name: "Bajaj Boxer Motorcycle",
    nameAm: "ባጃጅ ቦክስር ሞተርሳይክል",
    description:
      "Reliable motorcycle perfect for city commuting and short trips. Fuel-efficient and easy to ride.",
    descriptionAm:
      "ለከተማ መጓጓዣ እና ለአጭር ጉዞዎች ፍጹም የሆነ አስተማማኝ ሞተርሳይክል። ነዳጅ ቆጣቢ እና ለመንዳት ቀላል።",
    category: "cat-2",
    vendor: "vend-2",
    images: [
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600",
      "https://images.unsplash.com/photo-1583001931098-959e9a1a2ae1?w=600",
    ],
    pricing: {
      hourly: { amount: 25, label: "ETB 25/hour", labelAm: "25 ብር/ሰዓት" },
      daily: { amount: 200, label: "ETB 200/day", labelAm: "200 ብር/ቀን" },
      weekly: {
        amount: 1200,
        label: "ETB 1,200/week",
        labelAm: "1,200 ብር/ሳምንት",
      },
      monthly: {
        amount: 4500,
        label: "ETB 4,500/month",
        labelAm: "4,500 ብር/ወር",
      },
    },
    availability: {
      status: "available",
      statusAm: "ይገኛል",
      availableFrom: "2026-01-20",
      availableTo: "2026-12-31",
    },
    specifications: {
      make: "Bajaj",
      makeAm: "ባጃጅ",
      model: "Boxer",
      modelAm: "ቦክስር",
      year: 2023,
      mileage: "8,000 km",
      mileageAm: "8,000 ኪ.ሜ",
      fuelType: "Petrol",
      fuelTypeAm: "ቤንዚን",
      transmission: "Manual",
      transmissionAm: "በእጅ",
      engine: "125cc",
      engineAm: "125 ሲሲ",
    },
    rentalPolicies: {
      securityDeposit: {
        amount: 1000,
        label: "ETB 1,000",
        labelAm: "1,000 ብር",
      },
      lateFee: { amount: 100, label: "ETB 100/day", labelAm: "100 ብር/ቀን" },
      cancellationPolicy: "24 hours notice required",
      cancellationPolicyAm: "ከ24 ሰዓታት በፊት ማሳወቅ ያስፈልጋል",
      damageProtection: "Helmet included",
      damageProtectionAm: "ራስ ቆብ ተካቷል",
    },
    deliveryAvailable: false,
    deliveryAvailableAm: "አይደለም",
    rating: 4.5,
    totalReviews: 28,
    features: ["Fuel Efficient", "Easy Maneuver", "Comfortable Seat"],
    featuresAm: ["ነዳጅ ቆጣቢ", "በቀላሉ መሪ", "ምቹ መቀመጫ"],
    createdAt: "2024-03-15",
  },

  // BEAUTY EQUIPMENT
  {
    id: "prod-7",
    name: "Professional Hair Dryer - Salon Grade",
    nameAm: "ፕሮፌሽናል የፀጉር ማድረቂያ - ሳሎን ግሬድ",
    description:
      "High-quality professional hair dryer with ionic technology. Perfect for salons and home use.",
    descriptionAm:
      "በአዮኒክ ቴክኖሎጂ ከፍተኛ ጥራት ያለው ፕሮፌሽናል የፀጉር ማድረቂያ። ለሳሎኖች እና ለቤት አገልግሎት ፍጹም ነው።",
    category: "cat-3",
    vendor: "vend-3",
    images: [
      "https://images.unsplash.com/photo-1522338242992-e2a5492a6d8a?w=600",
      "https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=600",
    ],
    pricing: {
      hourly: { amount: 15, label: "ETB 15/hour", labelAm: "15 ብር/ሰዓት" },
      daily: { amount: 100, label: "ETB 100/day", labelAm: "100 ብር/ቀን" },
      weekly: { amount: 600, label: "ETB 600/week", labelAm: "600 ብር/ሳምንት" },
      monthly: {
        amount: 2000,
        label: "ETB 2,000/month",
        labelAm: "2,000 ብር/ወር",
      },
    },
    availability: {
      status: "available",
      statusAm: "ይገኛል",
      availableFrom: "2026-01-10",
      availableTo: "2026-12-31",
    },
    specifications: {
      brand: "Dyson",
      brandAm: "ዳይሰን",
      power: "2200W",
      powerAm: "2200 ዋት",
      technology: "Ionic",
      technologyAm: "አዮኒክ",
      attachments: "Diffuser, Concentrator",
      attachmentsAm: "ዲፍዩዘር፣ ኮንሰንትሬተር",
    },
    rentalPolicies: {
      securityDeposit: { amount: 500, label: "ETB 500", labelAm: "500 ብር" },
      lateFee: { amount: 50, label: "ETB 50/day", labelAm: "50 ብር/ቀን" },
      cancellationPolicy: "12 hours notice required",
      cancellationPolicyAm: "ከ12 ሰዓታት በፊት ማሳወቅ ያስፈልጋል",
    },
    deliveryAvailable: true,
    deliveryAvailableAm: "አዎ",
    rating: 4.9,
    totalReviews: 31,
    features: ["Ionic Technology", "Lightweight", "Multiple Settings"],
    featuresAm: ["አዮኒክ ቴክኖሎጂ", "ቀላል ክብደት", "በርካታ ቅንጅቶች"],
    createdAt: "2024-01-15",
  },
  {
    id: "prod-8",
    name: "Professional Hair Straightener",
    nameAm: "ፕሮፌሽናል የፀጉር ማስተካከያ",
    description:
      "Professional-grade hair straightener with ceramic plates for smooth, shiny results.",
    descriptionAm: "ለስላሳ እና አንጸባራቂ ውጤቶች በሴራሚክ ሳህኖች ፕሮፌሽናል-ደረጃ የፀጉር ማስተካከያ።",
    category: "cat-3",
    vendor: "vend-3",
    images: [
      "https://images.unsplash.com/photo-1516097272680-3dbb3cb74d63?w=600",
      "https://images.unsplash.com/photo-1515442261605-65987783cb5a?w=600",
    ],
    pricing: {
      hourly: { amount: 10, label: "ETB 10/hour", labelAm: "10 ብር/ሰዓት" },
      daily: { amount: 80, label: "ETB 80/day", labelAm: "80 ብር/ቀን" },
      weekly: { amount: 500, label: "ETB 500/week", labelAm: "500 ብር/ሳምንት" },
      monthly: {
        amount: 1800,
        label: "ETB 1,800/month",
        labelAm: "1,800 ብር/ወር",
      },
    },
    availability: {
      status: "available",
      statusAm: "ይገኛል",
      availableFrom: "2026-01-10",
      availableTo: "2026-12-31",
    },
    specifications: {
      brand: "GHD",
      brandAm: "ጂኤችዲ",
      plateType: "Ceramic",
      plateTypeAm: "ሴራሚክ",
      temperature: "185°C",
      temperatureAm: "185 ዲግሪ ሴልሺየስ",
      warmUp: "30 seconds",
      warmUpAm: "30 ሰከንዶች",
    },
    rentalPolicies: {
      securityDeposit: { amount: 400, label: "ETB 400", labelAm: "400 ብር" },
      lateFee: { amount: 40, label: "ETB 40/day", labelAm: "40 ብር/ቀን" },
      cancellationPolicy: "12 hours notice required",
      cancellationPolicyAm: "ከ12 ሰዓታት በፊት ማሳወቅ ያስፈልጋል",
    },
    deliveryAvailable: true,
    deliveryAvailableAm: "አዎ",
    rating: 4.8,
    totalReviews: 27,
    features: ["Ceramic Plates", "Quick Heat-Up", "Auto Shut-Off"],
    featuresAm: ["ሴራሚክ ሳህኖች", "ፈጣን ሙቀት", "ራስ-ገዝ መከልከል"],
    createdAt: "2024-01-20",
  },

  // AGRICULTURAL EQUIPMENT
  {
    id: "prod-9",
    name: "Tractor - Massey Ferguson 375",
    nameAm: "ትራክተር - ማሲ ፈርጉሰን 375",
    description:
      "Powerful tractor for agricultural work. Perfect for plowing, harvesting, and transportation.",
    descriptionAm: "ለግብርና ሥራ ኃይለኛ ትራክተር። ለማረስ፣ ለመከር እና ለመጓጓዣ ፍጹም ነው።",
    category: "cat-4",
    vendor: "vend-4",
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600",
      "https://images.unsplash.com/photo-1597404294360-feeeda04612c?w=600",
    ],
    pricing: {
      hourly: { amount: 180, label: "ETB 180/hour", labelAm: "180 ብር/ሰዓት" },
      daily: { amount: 1400, label: "ETB 1,400/day", labelAm: "1,400 ብር/ቀን" },
      weekly: {
        amount: 8500,
        label: "ETB 8,500/week",
        labelAm: "8,500 ብር/ሳምንት",
      },
      monthly: {
        amount: 30000,
        label: "ETB 30,000/month",
        labelAm: "30,000 ብር/ወር",
      },
    },
    availability: {
      status: "available",
      statusAm: "ይገኛል",
      availableFrom: "2026-02-01",
      availableTo: "2026-11-30",
    },
    specifications: {
      model: "Massey Ferguson 375",
      modelAm: "ማሲ ፈርጉሰን 375",
      year: 2022,
      horsepower: "75 HP",
      horsepowerAm: "75 የፈረስ ጉልበት",
      fuelType: "Diesel",
      fuelTypeAm: "ናፍጣ",
      transmission: "Manual",
      transmissionAm: "በእጅ",
      weight: "3,500 kg",
      weightAm: "3,500 ኪ.ግ",
    },
    rentalPolicies: {
      securityDeposit: {
        amount: 5000,
        label: "ETB 5,000",
        labelAm: "5,000 ብር",
      },
      lateFee: { amount: 500, label: "ETB 500/day", labelAm: "500 ብር/ቀን" },
      cancellationPolicy: "48 hours notice required",
      cancellationPolicyAm: "ከ48 ሰዓታት በፊት ማሳወቅ ያስፈልጋል",
      damageProtection: "Insurance required",
      damageProtectionAm: "ኢንሹራንስ ያስፈልጋል",
    },
    deliveryAvailable: true,
    deliveryAvailableAm: "አዎ",
    rating: 4.9,
    totalReviews: 19,
    features: ["AC Cabin", "Power Steering", "Hydraulic System"],
    featuresAm: ["ኤሲ ካቢን", "ፓወር ስቲሪንግ", "ሃይድሮሊክ ስርዓት"],
    createdAt: "2024-02-01",
  },
  {
    id: "prod-10",
    name: "Combine Harvester",
    nameAm: "ኮምባይን አጫጅ",
    description:
      "Modern combine harvester for efficient grain harvesting. Increases productivity and reduces labor costs.",
    descriptionAm:
      "ቀልጣፋ የእህል መከር ዘመናዊ ኮምባይን አጫጅ። ምርታማነትን ይጨምራል እና የሰው ኃይል ወጪዎችን ይቀንሳል።",
    category: "cat-4",
    vendor: "vend-4",
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600",
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600",
    ],
    pricing: {
      daily: { amount: 2500, label: "ETB 2,500/day", labelAm: "2,500 ብር/ቀን" },
      weekly: {
        amount: 15000,
        label: "ETB 15,000/week",
        labelAm: "15,000 ብር/ሳምንት",
      },
      monthly: {
        amount: 55000,
        label: "ETB 55,000/month",
        labelAm: "55,000 ብር/ወር",
      },
    },
    availability: {
      status: "available",
      statusAm: "ይገኛል",
      availableFrom: "2026-03-01",
      availableTo: "2026-10-31",
    },
    specifications: {
      brand: "John Deere",
      brandAm: "ጆን ዲር",
      model: "S660",
      modelAm: "S660",
      year: 2023,
      engine: "9.0L",
      engineAm: "9.0 ሊትር",
      horsepower: "360 HP",
      horsepowerAm: "360 የፈረስ ጉልበት",
    },
    rentalPolicies: {
      securityDeposit: {
        amount: 10000,
        label: "ETB 10,000",
        labelAm: "10,000 ብር",
      },
      lateFee: { amount: 1000, label: "ETB 1,000/day", labelAm: "1,000 ብር/ቀን" },
      cancellationPolicy: "7 days notice required",
      cancellationPolicyAm: "ከ7 ቀናት በፊት ማሳወቅ ያስፈልጋል",
      damageProtection: "Full insurance required",
      damageProtectionAm: "ሙሉ ኢንሹራንስ ያስፈልጋል",
    },
    deliveryAvailable: true,
    deliveryAvailableAm: "አዎ",
    rating: 4.8,
    totalReviews: 12,
    features: ["GPS Navigation", "Yield Monitor", "Auto Steer"],
    featuresAm: ["ጂፒኤስ ናቪጌሽን", "ምርት መቆጣጠሪያ", "ራስ-መሪ"],
    createdAt: "2024-02-15",
  },

  // EVENT SUPPLIES
  {
    id: "prod-11",
    name: "Party Tent - 10x10m",
    nameAm: "የፓርቲ ድንኳን - 10x10ሜ",
    description:
      "Large party tent for weddings, events, and outdoor gatherings. Holds up to 200 guests comfortably.",
    descriptionAm:
      "ለሠርግ፣ ለዝግጅቶች እና ለውጭ ስብሰባዎች ትልቅ የፓርቲ ድንኳን። እስከ 200 እንግዶችን በምቾት ይይዛል።",
    category: "cat-5",
    vendor: "vend-5",
    images: [
      "https://images.unsplash.com/photo-1505236272354-0e6c49dbb72d?w=600",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600",
    ],
    pricing: {
      daily: { amount: 600, label: "ETB 600/day", labelAm: "600 ብር/ቀን" },
      weekly: {
        amount: 3500,
        label: "ETB 3,500/week",
        labelAm: "3,500 ብር/ሳምንት",
      },
      monthly: {
        amount: 12000,
        label: "ETB 12,000/month",
        labelAm: "12,000 ብር/ወር",
      },
    },
    availability: {
      status: "available",
      statusAm: "ይገኛል",
      availableFrom: "2026-01-20",
      availableTo: "2026-12-31",
    },
    specifications: {
      dimensions: "10m x 10m",
      dimensionsAm: "10ሜ x 10ሜ",
      height: "4.5m",
      heightAm: "4.5 ሜትር",
      capacity: "200 people",
      capacityAm: "200 ሰዎች",
      material: "Waterproof PVC",
      materialAm: "ውሃ የማይገባ ፒቪሲ",
    },
    rentalPolicies: {
      securityDeposit: {
        amount: 2000,
        label: "ETB 2,000",
        labelAm: "2,000 ብር",
      },
      lateFee: { amount: 200, label: "ETB 200/day", labelAm: "200 ብር/ቀን" },
      cancellationPolicy: "48 hours notice required",
      cancellationPolicyAm: "ከ48 ሰዓታት በፊት ማሳወቅ ያስፈልጋል",
      damageProtection: "Insurance required",
      damageProtectionAm: "ኢንሹራንስ ያስፈልጋል",
    },
    deliveryAvailable: true,
    deliveryAvailableAm: "አዎ",
    rating: 4.7,
    totalReviews: 33,
    features: ["Waterproof", "UV Protected", "Side Panels Included"],
    featuresAm: ["ውሃ የማይገባ", "ከዩቪ የተጠበቀ", "የጎን ፓነሎች ተካተዋል"],
    createdAt: "2024-03-01",
  },
  {
    id: "prod-12",
    name: "Wedding Chairs - Set of 100",
    nameAm: "የሠርግ ወንበሮች - 100 ስብስብ",
    description:
      "Elegant wedding chairs with cushioned seats. Perfect for ceremonies, receptions, and formal events.",
    descriptionAm:
      "የተጠለፉ መቀመጫዎች ያላቸው ውብ የሠርግ ወንበሮች። ለሥነ-ሥርዓት፣ ለእንግዳ መቀበያ እና ለመደበኛ ዝግጅቶች ፍጹም ናቸው።",
    category: "cat-5",
    vendor: "vend-5",
    images: [
      "https://images.unsplash.com/photo-1530035415911-95194de4cb5b?w=600",
      "https://images.unsplash.com/photo-1525450691113-0fc1b5e69202?w=600",
    ],
    pricing: {
      daily: { amount: 150, label: "ETB 150/day", labelAm: "150 ብር/ቀን" },
      weekly: { amount: 900, label: "ETB 900/week", labelAm: "900 ብር/ሳምንት" },
      monthly: {
        amount: 3000,
        label: "ETB 3,000/month",
        labelAm: "3,000 ብር/ወር",
      },
    },
    availability: {
      status: "available",
      statusAm: "ይገኛል",
      availableFrom: "2026-01-15",
      availableTo: "2026-12-31",
    },
    specifications: {
      quantity: 100,
      quantityAm: "100",
      type: "Chiavari",
      typeAm: "ቺያቫሪ",
      material: "Wood",
      materialAm: "እንጨት",
      color: "Gold",
      colorAm: "ወርቃማ",
      includesCushion: true,
      includesCushionAm: "የተጠለፈ ነው",
    },
    rentalPolicies: {
      securityDeposit: {
        amount: 1000,
        label: "ETB 1,000",
        labelAm: "1,000 ብር",
      },
      lateFee: { amount: 100, label: "ETB 100/day", labelAm: "100 ብር/ቀን" },
      cancellationPolicy: "24 hours notice required",
      cancellationPolicyAm: "ከ24 ሰዓታት በፊት ማሳወቅ ያስፈልጋል",
    },
    deliveryAvailable: true,
    deliveryAvailableAm: "አዎ",
    rating: 4.5,
    totalReviews: 28,
    features: ["Elegant Design", "Comfortable", "Stackable"],
    featuresAm: ["ውብ ንድፍ", "ምቹ", "መደራረብ የሚቻል"],
    createdAt: "2024-03-15",
  },

  // ELECTRONICS
  {
    id: "prod-13",
    name: "4K Projector - Epson EB-2000",
    nameAm: "4K ፕሮጀክተር - ኤፕሰን EB-2000",
    description:
      "High-end 4K projector for presentations, movie nights, and events. Crystal clear image quality.",
    descriptionAm:
      "ለአቀራረቦች፣ ለፊልም ምሽቶች እና ለዝግጅቶች ከፍተኛ ደረጃ 4K ፕሮጀክተር። ክሪስታል ግልጽ የምስል ጥራት።",
    category: "cat-6",
    vendor: "vend-6",
    images: [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600",
    ],
    pricing: {
      daily: { amount: 250, label: "ETB 250/day", labelAm: "250 ብር/ቀን" },
      weekly: {
        amount: 1500,
        label: "ETB 1,500/week",
        labelAm: "1,500 ብር/ሳምንት",
      },
      monthly: {
        amount: 5000,
        label: "ETB 5,000/month",
        labelAm: "5,000 ብር/ወር",
      },
    },
    availability: {
      status: "available",
      statusAm: "ይገኛል",
      availableFrom: "2026-02-01",
      availableTo: "2026-12-31",
    },
    specifications: {
      brand: "Epson",
      brandAm: "ኤፕሰን",
      model: "EB-2000",
      modelAm: "EB-2000",
      resolution: "4K (3840x2160)",
      resolutionAm: "4K (3840x2160)",
      brightness: "4000 Lumens",
      brightnessAm: "4000 ሉመንስ",
      lampLife: "5000 hours",
      lampLifeAm: "5000 ሰዓታት",
    },
    rentalPolicies: {
      securityDeposit: {
        amount: 2000,
        label: "ETB 2,000",
        labelAm: "2,000 ብር",
      },
      lateFee: { amount: 200, label: "ETB 200/day", labelAm: "200 ብር/ቀን" },
      cancellationPolicy: "24 hours notice required",
      cancellationPolicyAm: "ከ24 ሰዓታት በፊት ማሳወቅ ያስፈልጋል",
      damageProtection: "Insurance required",
      damageProtectionAm: "ኢንሹራንስ ያስፈልጋል",
    },
    deliveryAvailable: true,
    deliveryAvailableAm: "አዎ",
    rating: 4.6,
    totalReviews: 22,
    features: ["4K Resolution", "HDMI Input", "Built-in Speakers"],
    featuresAm: ["4K ጥራት", "ኤችዲኤምአይ ግቤት", "የተገነቡ ድምጽ ማጉያዎች"],
    createdAt: "2024-04-01",
  },
  {
    id: "prod-14",
    name: "Canon 5D Mark IV Camera",
    nameAm: "ካኖን 5D ማርክ IV ካሜራ",
    description:
      "Professional DSLR camera perfect for photographers and videographers. Full-frame sensor with 4K video.",
    descriptionAm:
      "ለፎቶግራፍ ባለሙያዎች እና ቪዲዮ ባለሙያዎች ፍጹም የሆነ ፕሮፌሽናል ዲኤስኤልአር ካሜራ። ሙሉ-ፍሬም ዳሳሽ ከ4K ቪዲዮ ጋር።",
    category: "cat-6",
    vendor: "vend-6",
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600",
    ],
    pricing: {
      hourly: { amount: 40, label: "ETB 40/hour", labelAm: "40 ብር/ሰዓት" },
      daily: { amount: 300, label: "ETB 300/day", labelAm: "300 ብር/ቀን" },
      weekly: {
        amount: 1800,
        label: "ETB 1,800/week",
        labelAm: "1,800 ብር/ሳምንት",
      },
      monthly: {
        amount: 6000,
        label: "ETB 6,000/month",
        labelAm: "6,000 ብር/ወር",
      },
    },
    availability: {
      status: "available",
      statusAm: "ይገኛል",
      availableFrom: "2026-01-20",
      availableTo: "2026-12-31",
    },
    specifications: {
      brand: "Canon",
      brandAm: "ካኖን",
      model: "5D Mark IV",
      modelAm: "5D ማርክ IV",
      resolution: "30.4 MP",
      resolutionAm: "30.4 ሜጋፒክስል",
      video: "4K 30fps",
      videoAm: "4K 30fps",
      lens: "24-105mm",
      lensAm: "24-105ሚሜ",
    },
    rentalPolicies: {
      securityDeposit: {
        amount: 2500,
        label: "ETB 2,500",
        labelAm: "2,500 ብር",
      },
      lateFee: { amount: 250, label: "ETB 250/day", labelAm: "250 ብር/ቀን" },
      cancellationPolicy: "24 hours notice required",
      cancellationPolicyAm: "ከ24 ሰዓታት በፊት ማሳወቅ ያስፈልጋል",
      damageProtection: "Insurance required",
      damageProtectionAm: "ኢንሹራንስ ያስፈልጋል",
    },
    deliveryAvailable: true,
    deliveryAvailableAm: "አዎ",
    rating: 4.9,
    totalReviews: 38,
    features: ["Full Frame", "4K Video", "Dual Pixel AF"],
    featuresAm: ["ሙሉ ፍሬም", "4K ቪዲዮ", "ዱዋል ፒክስል ኤኤፍ"],
    createdAt: "2024-04-15",
  },

  // SPORTS EQUIPMENT
  {
    id: "prod-15",
    name: "Treadmill - ProForm 5000",
    nameAm: "ትሬድሚል - ፕሮፎርም 5000",
    description:
      "Commercial-grade treadmill with incline and speed controls. Perfect for home gyms and fitness centers.",
    descriptionAm:
      "የንግድ-ደረጃ ትሬድሚል ከማዘንበል እና የፍጥነት መቆጣጠሪያዎች ጋር። ለቤት ጂሞች እና ለአካል ብቃት ማእከላት ፍጹም ነው።",
    category: "cat-7",
    vendor: "vend-7",
    images: [
      "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600",
      "https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=600",
    ],
    pricing: {
      daily: { amount: 150, label: "ETB 150/day", labelAm: "150 ብር/ቀን" },
      weekly: { amount: 900, label: "ETB 900/week", labelAm: "900 ብር/ሳምንት" },
      monthly: {
        amount: 3000,
        label: "ETB 3,000/month",
        labelAm: "3,000 ብር/ወር",
      },
    },
    availability: {
      status: "available",
      statusAm: "ይገኛል",
      availableFrom: "2026-02-01",
      availableTo: "2026-12-31",
    },
    specifications: {
      brand: "ProForm",
      brandAm: "ፕሮፎርም",
      model: "5000",
      modelAm: "5000",
      maxSpeed: "20 km/h",
      maxSpeedAm: "20 ኪ.ሜ/ሰዓት",
      maxIncline: "15%",
      maxInclineAm: "15%",
      display: "LCD Touch Screen",
      displayAm: "ኤልሲዲ ንክኪ ማያ",
      weight: "150 kg",
      weightAm: "150 ኪ.ግ",
    },
    rentalPolicies: {
      securityDeposit: {
        amount: 1500,
        label: "ETB 1,500",
        labelAm: "1,500 ብር",
      },
      lateFee: { amount: 150, label: "ETB 150/day", labelAm: "150 ብር/ቀን" },
      cancellationPolicy: "24 hours notice required",
      cancellationPolicyAm: "ከ24 ሰዓታት በፊት ማሳወቅ ያስፈልጋል",
    },
    deliveryAvailable: true,
    deliveryAvailableAm: "አዎ",
    rating: 4.4,
    totalReviews: 19,
    features: ["Incline Control", "Heart Rate Monitor", "Built-in Programs"],
    featuresAm: ["ማዘንበል መቆጣጠሪያ", "የልብ ምት መቆጣጠሪያ", "የተገነቡ ፕሮግራሞች"],
    createdAt: "2024-05-01",
  },
  {
    id: "prod-16",
    name: "Mountain Bike - Trek X-Caliber 9",
    nameAm: "የተራራ ብስክሌት - ትሬክ X-ካሊበር 9",
    description:
      "High-performance mountain bike for off-road adventures. Lightweight frame with premium components.",
    descriptionAm:
      "ለመንገድ ውጭ ጉዞዎች ከፍተኛ አፈጻጸም ያለው የተራራ ብስክሌት። ቀላል ክብደት ያለው ፍሬም ከፕሪሚየም ክፍሎች ጋር።",
    category: "cat-7",
    vendor: "vend-7",
    images: [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600",
      "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600",
    ],
    pricing: {
      hourly: { amount: 20, label: "ETB 20/hour", labelAm: "20 ብር/ሰዓት" },
      daily: { amount: 150, label: "ETB 150/day", labelAm: "150 ብር/ቀን" },
      weekly: { amount: 900, label: "ETB 900/week", labelAm: "900 ብር/ሳምንት" },
      monthly: {
        amount: 3000,
        label: "ETB 3,000/month",
        labelAm: "3,000 ብር/ወር",
      },
    },
    availability: {
      status: "available",
      statusAm: "ይገኛል",
      availableFrom: "2026-03-01",
      availableTo: "2026-12-31",
    },
    specifications: {
      brand: "Trek",
      brandAm: "ትሬክ",
      model: "X-Caliber 9",
      modelAm: "X-ካሊበር 9",
      frame: "Aluminum",
      frameAm: "አሉሚኒየም",
      suspension: "RockShox",
      suspensionAm: "ሮክሾክስ",
      wheelSize: "29 inches",
      wheelSizeAm: "29 ኢንች",
      gear: "Shimano Deore",
      gearAm: "ሺማኖ ዲዮር",
    },
    rentalPolicies: {
      securityDeposit: { amount: 800, label: "ETB 800", labelAm: "800 ብር" },
      lateFee: { amount: 80, label: "ETB 80/day", labelAm: "80 ብር/ቀን" },
      cancellationPolicy: "12 hours notice required",
      cancellationPolicyAm: "ከ12 ሰዓታት በፊት ማሳወቅ ያስፈልጋል",
      damageProtection: "Helmet included",
      damageProtectionAm: "ራስ ቆብ ተካቷል",
    },
    deliveryAvailable: false,
    deliveryAvailableAm: "አይደለም",
    rating: 4.6,
    totalReviews: 25,
    features: ["Lightweight", "Disc Brakes", "Lockout Suspension"],
    featuresAm: ["ቀላል ክብደት", "ዲስክ ብሬክ", "መቆለፊያ እገዳ"],
    createdAt: "2024-05-15",
  },

  // HOME & GARDEN
  {
    id: "prod-17",
    name: "Pressure Washer - Karcher K5",
    nameAm: "ፕሬሸር ዋሸር - ካርቸር K5",
    description:
      "Professional pressure washer for cleaning driveways, patios, and vehicles. Powerful and efficient.",
    descriptionAm:
      "የመኪና መንገዶችን፣ ቴራሶችን እና ተሽከርካሪዎችን ለማጽዳት ፕሮፌሽናል ግፊት ማጠቢያ። ኃይለኛ እና ቀልጣፋ።",
    category: "cat-8",
    vendor: "vend-8",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85f32b?w=600",
      "https://images.unsplash.com/photo-1545140705-8a1f2f3d3b3f?w=600",
    ],
    pricing: {
      hourly: { amount: 20, label: "ETB 20/hour", labelAm: "20 ብር/ሰዓት" },
      daily: { amount: 150, label: "ETB 150/day", labelAm: "150 ብር/ቀን" },
      weekly: { amount: 900, label: "ETB 900/week", labelAm: "900 ብር/ሳምንት" },
      monthly: {
        amount: 3000,
        label: "ETB 3,000/month",
        labelAm: "3,000 ብር/ወር",
      },
    },
    availability: {
      status: "available",
      statusAm: "ይገኛል",
      availableFrom: "2026-02-15",
      availableTo: "2026-12-31",
    },
    specifications: {
      brand: "Karcher",
      brandAm: "ካርቸር",
      model: "K5",
      modelAm: "K5",
      pressure: "3000 PSI",
      pressureAm: "3000 ፒኤስአይ",
      power: "2.4 kW",
      powerAm: "2.4 ኪሎዋት",
      hoseLength: "20m",
      hoseLengthAm: "20 ሜትር",
      includesNozzles: true,
      includesNozzlesAm: "አፍንጫዎች ተካተዋል",
    },
    rentalPolicies: {
      securityDeposit: { amount: 500, label: "ETB 500", labelAm: "500 ብር" },
      lateFee: { amount: 50, label: "ETB 50/day", labelAm: "50 ብር/ቀን" },
      cancellationPolicy: "12 hours notice required",
      cancellationPolicyAm: "ከ12 ሰዓታት በፊት ማሳወቅ ያስፈልጋል",
    },
    deliveryAvailable: true,
    deliveryAvailableAm: "አዎ",
    rating: 4.7,
    totalReviews: 20,
    features: ["Adjustable Pressure", "Multiple Nozzles", "Auto Shut-Off"],
    featuresAm: ["ሊስተካከል የሚችል ግፊት", "በርካታ አፍንጫዎች", "ራስ-ገዝ መከልከል"],
    createdAt: "2024-06-01",
  },
  {
    id: "prod-18",
    name: "Lawn Mower - Honda HRX217",
    nameAm: "ሞውነር - ሆንዳ HRX217",
    description:
      "Self-propelled lawn mower for large gardens. Reliable Honda engine with easy start technology.",
    descriptionAm:
      "ለትልቅ የአትክልት ቦታዎች ራስ-ገዝ የሣር መቁረጫ። አስተማማኝ የሆንዳ ሞተር ከቀላል መነሻ ቴክኖሎጂ ጋር።",
    category: "cat-8",
    vendor: "vend-8",
    images: [
      "https://images.unsplash.com/photo-1579864096356-80069b60b949?w=600",
      "https://images.unsplash.com/photo-1558618666-fcd25c85f32b?w=600",
    ],
    pricing: {
      hourly: { amount: 25, label: "ETB 25/hour", labelAm: "25 ብር/ሰዓት" },
      daily: { amount: 180, label: "ETB 180/day", labelAm: "180 ብር/ቀን" },
      weekly: {
        amount: 1000,
        label: "ETB 1,000/week",
        labelAm: "1,000 ብር/ሳምንት",
      },
      monthly: {
        amount: 3500,
        label: "ETB 3,500/month",
        labelAm: "3,500 ብር/ወር",
      },
    },
    availability: {
      status: "available",
      statusAm: "ይገኛል",
      availableFrom: "2026-03-01",
      availableTo: "2026-12-31",
    },
    specifications: {
      brand: "Honda",
      brandAm: "ሆንዳ",
      model: "HRX217",
      modelAm: "HRX217",
      engine: "187cc",
      engineAm: "187 ሲሲ",
      cuttingWidth: "21 inches",
      cuttingWidthAm: "21 ኢንች",
      heightAdjustment: "7 positions",
      heightAdjustmentAm: "7 ቦታዎች",
    },
    rentalPolicies: {
      securityDeposit: { amount: 800, label: "ETB 800", labelAm: "800 ብር" },
      lateFee: { amount: 80, label: "ETB 80/day", labelAm: "80 ብር/ቀን" },
      cancellationPolicy: "24 hours notice required",
      cancellationPolicyAm: "ከ24 ሰዓታት በፊት ማሳወቅ ያስፈልጋል",
    },
    deliveryAvailable: true,
    deliveryAvailableAm: "አዎ",
    rating: 4.5,
    totalReviews: 16,
    features: ["Self-Propelled", "Mulching", "Easy Start"],
    featuresAm: ["ራስ-ገዝ", "ማልችንግ", "ቀላል መነሻ"],
    createdAt: "2024-06-15",
  },
];

// ---------- BOOKINGS ----------
export const bookings = [
  {
    id: "book-1",
    productId: "rent-4",
    customerId: "user-1",
    vendorId: "vend-2",
    startDate: "2026-01-15",
    endDate: "2026-01-18",
    totalAmount: 2400,
    status: "confirmed",
    statusAm: "የተረጋገጠ",
    paymentStatus: "paid",
    paymentStatusAm: "ተከፍሏል",
    items: 1,
    deliveryAddress: "123 iShare Plaza, Addis Ababa",
    deliveryAddressAm: "123 አይሸር ፕላዛ፣ አዲስ አበባ",
    createdAt: "2026-01-10",
  },
  {
    id: "book-2",
    productId: "rent-1",
    customerId: "user-2",
    vendorId: "vend-1",
    startDate: "2026-02-01",
    endDate: "2026-02-05",
    totalAmount: 7200,
    status: "pending",
    statusAm: "በመጠባበቅ ላይ",
    paymentStatus: "unpaid",
    paymentStatusAm: "አልተከፈለም",
    items: 1,
    deliveryAddress: "123 iShare Plaza, Addis Ababa",
    deliveryAddressAm: "123 አይሸር ፕላዛ፣ አዲስ አበባ",
    createdAt: "2026-01-28",
  },
  {
    id: "book-3",
    productId: "rent-3",
    customerId: "user-3",
    vendorId: "vend-3",
    startDate: "2026-01-20",
    endDate: "2026-01-21",
    totalAmount: 200,
    status: "completed",
    statusAm: "ተጠናቋል",
    paymentStatus: "paid",
    paymentStatusAm: "ተከፍሏል",
    items: 2,
    deliveryAddress: "123 iShare Plaza, Addis Ababa",
    deliveryAddressAm: "123 አይሸር ፕላዛ፣ አዲስ አበባ",
    createdAt: "2026-01-18",
  },
  {
    id: "book-4",
    productId: "rent-4",
    customerId: "user-1",
    vendorId: "vend-4",
    startDate: "2026-02-10",
    endDate: "2026-02-12",
    totalAmount: 4200,
    status: "confirmed",
    statusAm: "የተረጋገጠ",
    paymentStatus: "paid",
    paymentStatusAm: "ተከፍሏል",
    items: 1,
    deliveryAddress: "123 iShare Plaza, Addis Ababa",
    deliveryAddressAm: "123 አይሸር ፕላዛ፣ አዲስ አበባ",
    createdAt: "2026-02-05",
  },
  {
    id: "book-5",
    productId: "rent-1",
    customerId: "user-4",
    vendorId: "vend-5",
    startDate: "2026-03-15",
    endDate: "2026-03-16",
    totalAmount: 1200,
    status: "pending",
    statusAm: "በመጠባበቅ ላይ",
    paymentStatus: "unpaid",
    paymentStatusAm: "አልተከፈለም",
    items: 3,
    deliveryAddress: "123 iShare Plaza, Addis Ababa",
    deliveryAddressAm: "123 አይሸር ፕላዛ፣ አዲስ አበባ",
    createdAt: "2026-03-10",
  },
];

// ---------- REVIEWS ----------
export const reviews = [
  {
    id: "rev-1",
    productId: "prod-4",
    customerId: "user-1",
    customerName: "Abebe Kebede",
    customerNameAm: "አበበ ከበደ",
    rating: 5,
    comment:
      "Excellent car! Very clean and well-maintained. The pickup and drop-off process was seamless.",
    commentAm:
      "በጣም ጥሩ መኪና! በጣም ንጹህ እና በደንብ የተጠበቀ። የመውሰድ እና የመልቀቅ ሂደቱ እንከን የለሽ ነበር።",
    createdAt: "2026-01-20",
  },
  {
    id: "rev-2",
    productId: "prod-1",
    customerId: "user-2",
    customerName: "Tigist Hailu",
    customerNameAm: "ጥግስት ኃይሉ",
    rating: 4,
    comment:
      "The excavator worked perfectly for our project. Only minor issue with delivery timing.",
    commentAm: "መቆፈሪያው ለፕሮጀክታችን በትክክል ሠራ። በአቅርቦት ጊዜ ላይ ትንሽ ችግር ብቻ።",
    createdAt: "2026-02-08",
  },
  {
    id: "rev-3",
    productId: "prod-7",
    customerId: "user-3",
    customerName: "Dawit Eshetu",
    customerNameAm: "ዳዊት እሸቱ",
    rating: 5,
    comment:
      "Amazing hair dryer! My salon clients love it. Will definitely rent again.",
    commentAm: "አስደናቂ የፀጉር ማድረቂያ! የሳሎን ደንበኞቼ ይወዱታል። በእርግጠኝነት እንደገና እከራያለሁ።",
    createdAt: "2026-01-22",
  },
  {
    id: "rev-4",
    productId: "prod-9",
    customerId: "user-1",
    customerName: "Abebe Kebede",
    customerNameAm: "አበበ ከበደ",
    rating: 5,
    comment:
      "The tractor was in excellent condition. Helped us complete our farm work efficiently.",
    commentAm: "ትራክተሩ በጣም ጥሩ ሁኔታ ላይ ነበር። የእርሻ ሥራችንን በብቃት እንድንጨርስ ረድቶናል።",
    createdAt: "2026-02-15",
  },
  {
    id: "rev-5",
    productId: "prod-11",
    customerId: "user-4",
    customerName: "Selam Tesfaye",
    customerNameAm: "ሰላም ተስፋዬ",
    rating: 4,
    comment:
      "Great tent for our wedding. It was spacious and looked beautiful. Delivery was on time.",
    commentAm: "ለሠርጋችን ጥሩ ድንኳን። ሰፊ እና ውብ ነበር። አቅርቦቱ በጊዜው ነበር።",
    createdAt: "2026-03-18",
  },
];

// ---------- NOTIFICATIONS ----------
export const notifications = [
  {
    id: "notif-1",
    type: "booking_request",
    typeAm: "የቦታ ማስያዝ ጥያቄ",
    message: "New booking request for Toyota Land Cruiser",
    messageAm: "ለቶዮታ ላንድ ክሩዘር አዲስ የቦታ ማስያዝ ጥያቄ",
    read: false,
    readAm: "አልተነበበም",
    createdAt: "2026-07-21T10:30:00",
  },
  {
    id: "notif-2",
    type: "payment_confirmed",
    typeAm: "ክፍያ ተረጋግጧል",
    message: "Payment confirmed for Excavator rental",
    messageAm: "ለመቆፈሪያ ኪራይ ክፍያ ተረጋግጧል",
    read: false,
    readAm: "አልተነበበም",
    createdAt: "2026-07-21T09:15:00",
  },
  {
    id: "notif-3",
    type: "subscription_expiry",
    typeAm: "የደንበኝነት ምዝገባ ማብቂያ",
    message: "Your subscription expires in 7 days",
    messageAm: "የደንበኝነት ምዝገባዎ በ7 ቀናት ውስጥ ያበቃል",
    read: true,
    readAm: "ተነብቧል",
    createdAt: "2026-07-20T14:00:00",
  },
  {
    id: "notif-4",
    type: "return_reminder",
    typeAm: "የመመለስ ማስታወሻ",
    message: "Reminder: Return Toyota Land Cruiser tomorrow",
    messageAm: "ማስታወሻ: ቶዮታ ላንድ ክሩዘርን ነገ መመለስ",
    read: true,
    readAm: "ተነብቧል",
    createdAt: "2026-07-20T08:00:00",
  },
];

// ---------- COUPONS ----------
export const coupons = [
  {
    id: "coupon-1",
    code: "WELCOME10",
    discount: 10,
    type: "percentage",
    typeAm: "መቶኛ",
    validUntil: "2026-12-31",
    description: "10% off your first booking",
    descriptionAm: "በመጀመሪያ ቦታ ማስያዝዎ 10% ቅናሽ",
    minOrder: 1000,
    minOrderAm: "1000 ብር",
  },
  {
    id: "coupon-2",
    code: "SUMMER20",
    discount: 20,
    type: "percentage",
    typeAm: "መቶኛ",
    validUntil: "2026-08-31",
    description: "20% off summer rentals",
    descriptionAm: "በበጋ ኪራዮች 20% ቅናሽ",
    minOrder: 2000,
    minOrderAm: "2000 ብር",
  },
  {
    id: "coupon-3",
    code: "FREEDELIVERY",
    discount: 500,
    type: "fixed",
    typeAm: "ቋሚ",
    validUntil: "2026-12-31",
    description: "Free delivery on any order",
    descriptionAm: "በማንኛውም ትዕዛዝ ላይ ነጻ አቅርቦት",
    minOrder: 1500,
    minOrderAm: "1500 ብር",
  },
];

// ---------- USERS ----------
export const users = [
  {
    id: "user-1",
    name: "Abebe Kebede",
    nameAm: "አበበ ከበደ",
    email: "abebe@email.com",
    role: "customer",
    roleAm: "ደንበኛ",
    phone: "+251-900-111-222",
    avatar:
      "https://ui-avatars.com/api/?name=Abebe+Kebede&size=100&background=F97316&color=fff",
    joinDate: "2025-12-01",
  },
  {
    id: "user-2",
    name: "Tigist Hailu",
    nameAm: "ጥግስት ኃይሉ",
    email: "tigist@email.com",
    role: "customer",
    roleAm: "ደንበኛ",
    phone: "+251-900-333-444",
    avatar:
      "https://ui-avatars.com/api/?name=Tigist+Hailu&size=100&background=F97316&color=fff",
    joinDate: "2025-12-15",
  },
  {
    id: "user-3",
    name: "Dawit Eshetu",
    nameAm: "ዳዊት እሸቱ",
    email: "dawit@email.com",
    role: "customer",
    roleAm: "ደንበኛ",
    phone: "+251-900-555-666",
    avatar:
      "https://ui-avatars.com/api/?name=Dawit+Eshetu&size=100&background=F97316&color=fff",
    joinDate: "2026-01-10",
  },
  {
    id: "user-4",
    name: "Selam Tesfaye",
    nameAm: "ሰላም ተስፋዬ",
    email: "selam@email.com",
    role: "customer",
    roleAm: "ደንበኛ",
    phone: "+251-900-777-888",
    avatar:
      "https://ui-avatars.com/api/?name=Selam+Tesfaye&size=100&background=F97316&color=fff",
    joinDate: "2026-02-05",
  },
];

// ---------- TRANSLATION HELPER ----------
// Helper function to get translated text based on language
export const getTranslation = (data, lang = "en") => {
  if (lang === "am" && data && typeof data === "object") {
    // Check if there's an Amharic version available
    const amKey = Object.keys(data).find((key) => key.endsWith("Am"));
    if (amKey && data[amKey]) {
      return data[amKey];
    }
    // Try to find any property ending with 'Am'
    for (const key in data) {
      if (key.endsWith("Am") && data[key]) {
        return data[key];
      }
    }
  }
  // Return the original data or try to find the English version
  if (typeof data === "object" && data !== null) {
    const enKey = Object.keys(data).find((key) => !key.endsWith("Am"));
    if (enKey && data[enKey]) {
      return data[enKey];
    }
    // If it's a simple object with label or name properties
    if (data.label) return data.label;
    if (data.name) return data.name;
    if (data.description) return data.description;
  }
  return data;
};

// ---------- HELPERS ----------
// Get product by ID
export const getProductById = (id) => products.find((p) => p.id === id);

// Get vendor by ID
export const getVendorById = (id) => vendors.find((v) => v.id === id);

// Get category by ID
export const getCategoryById = (id) => categories.find((c) => c.id === id);

// Get products by category
export const getProductsByCategory = (categoryId) =>
  products.filter((p) => p.category === categoryId);

// Get products by vendor
export const getProductsByVendor = (vendorId) =>
  products.filter((p) => p.vendor === vendorId);

// Get bookings by user
export const getBookingsByUser = (userId) =>
  bookings.filter((b) => b.customerId === userId);

// Get reviews by product
export const getReviewsByProduct = (productId) =>
  reviews.filter((r) => r.productId === productId);

// Get average rating for vendor
export const getVendorRating = (vendorId) => {
  const vendorProducts = products.filter((p) => p.vendor === vendorId);
  if (vendorProducts.length === 0) return 0;
  const totalRating = vendorProducts.reduce((sum, p) => sum + p.rating, 0);
  return totalRating / vendorProducts.length;
};

// Get total revenue for vendor
export const getVendorRevenue = (vendorId) => {
  const vendorBookings = bookings.filter((b) => b.vendorId === vendorId);
  return vendorBookings.reduce((sum, b) => sum + b.totalAmount, 0);
};

// Get featured products
export const getFeaturedProducts = () =>
  products.filter((p) => p.rating >= 4.7).slice(0, 6);

// Get recent products
export const getRecentProducts = () =>
  [...products]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);

// Get top rated vendors
export const getTopVendors = () =>
  [...vendors].sort((a, b) => b.rating - a.rating).slice(0, 5);

// Search products by name/description (supports both languages)
export const searchProducts = (query, lang = "en") => {
  const searchTerm = query.toLowerCase();
  return products.filter((p) => {
    const name = lang === "am" ? p.nameAm : p.name;
    const desc = lang === "am" ? p.descriptionAm : p.description;
    return (
      name.toLowerCase().includes(searchTerm) ||
      desc.toLowerCase().includes(searchTerm)
    );
  });
};

// Default export with all data
export default {
  categories,
  vendors,
  products,
  bookings,
  reviews,
  notifications,
  coupons,
  users,
  getProductById,
  getVendorById,
  getCategoryById,
  getProductsByCategory,
  getProductsByVendor,
  getBookingsByUser,
  getReviewsByProduct,
  getVendorRating,
  getVendorRevenue,
  getFeaturedProducts,
  getRecentProducts,
  getTopVendors,
  searchProducts,
  getTranslation,
};
