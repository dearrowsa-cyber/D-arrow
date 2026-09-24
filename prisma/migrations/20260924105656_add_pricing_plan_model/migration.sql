-- CreateTable
CREATE TABLE "PricingPlan" (
    "id" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "audienceAr" TEXT NOT NULL,
    "audienceEn" TEXT NOT NULL,
    "priceRange" TEXT NOT NULL,
    "priceUnitAr" TEXT NOT NULL DEFAULT 'ر.س / شهرياً',
    "priceUnitEn" TEXT NOT NULL DEFAULT 'SAR / month',
    "noteAr" TEXT,
    "noteEn" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "badgeAr" TEXT,
    "badgeEn" TEXT,
    "features" TEXT NOT NULL,
    "ctaAr" TEXT NOT NULL DEFAULT 'ابدأ الآن',
    "ctaEn" TEXT NOT NULL DEFAULT 'Get Started',
    "status" TEXT NOT NULL DEFAULT 'published',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PricingPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RealEstateAgent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameEn" TEXT,
    "jobTitle" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "whatsapp" TEXT,
    "email" TEXT,
    "avatarUrl" TEXT,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 4.8,
    "dealsClosed" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RealEstateAgent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RealEstateProperty" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'villa',
    "listingType" TEXT NOT NULL DEFAULT 'sale',
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'SAR',
    "city" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "bedrooms" INTEGER NOT NULL DEFAULT 0,
    "bathrooms" INTEGER NOT NULL DEFAULT 0,
    "areaSqm" INTEGER NOT NULL,
    "features" TEXT,
    "images" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'available',
    "agentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RealEstateProperty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RealEstateInquiry" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RealEstateInquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RealEstateProperty_slug_key" ON "RealEstateProperty"("slug");

-- AddForeignKey
ALTER TABLE "RealEstateProperty" ADD CONSTRAINT "RealEstateProperty_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "RealEstateAgent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
