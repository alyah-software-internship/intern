import { lazy } from "react";
import Hero from "../../component/home/Hero.jsx";
import BrowseCategories from "../../component/home/BrowseCategories.jsx";
import DeferredSection from "../../component/DeferredSection.jsx";

const HandPicked = lazy(() => import("../../component/home/HandPicked.jsx"));
const MarketPlaceJourny = lazy(
  () => import("../../component/home/MarketPlaceJourny.jsx"),
);
const TrustedBy = lazy(() => import("../../component/home/TrustedBy.jsx"));
const UserReview = lazy(() => import("../../component/home/UserReview.jsx"));
const Subscribe = lazy(() => import("../../component/home/Subscribe.jsx"));

const deferredFallback = <div style={{ minHeight: 180 }} />;

function Home() {
  return (
    <div>
      <Hero />

      <div style={{ marginTop: 24 }}>
        <BrowseCategories />
        <div style={{ marginTop: 24 }}>
          <DeferredSection fallback={deferredFallback}>
            <HandPicked />
          </DeferredSection>
        </div>

        <div style={{ marginTop: 24 }}>
          <DeferredSection fallback={deferredFallback}>
            <MarketPlaceJourny />
          </DeferredSection>
        </div>
        <DeferredSection fallback={deferredFallback}>
          <TrustedBy />
        </DeferredSection>
        <div style={{ marginTop: 24 }}>
          <DeferredSection fallback={deferredFallback}>
            <UserReview />
          </DeferredSection>
        </div>
        <div style={{ marginTop: 24 }}>
          <DeferredSection fallback={deferredFallback}>
            <Subscribe />
          </DeferredSection>
        </div>
      </div>
    </div>
  );
}

export default Home;
