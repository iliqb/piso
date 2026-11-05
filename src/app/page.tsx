import { VideoHero } from "@/components/VideoHero";
import { PropertyHero } from "@/components/landing/PropertyHero";
import { DevelopmentSections } from "@/components/landing/DevelopmentSections";
import { AmenitiesAndModel } from "@/components/landing/AmenitiesAndModel";
import { PaymentPlan } from "@/components/landing/PaymentPlan";

export default function Home() {
  return <main><VideoHero /><PropertyHero /><DevelopmentSections /><AmenitiesAndModel /><PaymentPlan /></main>;
}
