import DashboardShortcut from "../../component/home/DashboardShortcut.jsx";
import Hero from "../../component/home/Hero.jsx";
import BrowseCategories from "../../component/home/BrowseCategories.jsx";
import HandPicked from "../../component/home/HandPicked.jsx";
import { Row, Col } from "antd";
import MarketPlaceJourny from "../../component/home/MarketPlaceJourny.jsx";
import TrustedBy from "../../component/home/TrustedBy.jsx";
import UserReview from "../../component/home/UserReview.jsx";
import Subscribe from "../../component/home/Subscribe.jsx";
import FooterLink from "../../component/home/FooterLink.jsx";

function Home() {
  return (
    <div>
      <Hero />

      <DashboardShortcut />
      <div style={{ marginTop: 24 }}>
        <BrowseCategories />
        <div style={{ marginTop: 24 }}>
          <HandPicked />
        </div>

        <div style={{ marginTop: 24 }}>
          <MarketPlaceJourny />
        </div>
        <TrustedBy />
        <div style={{ marginTop: 24 }}>
          <UserReview />
        </div>
        <div style={{ marginTop: 24 }}>
          <Subscribe />
        </div>
        <div style={{ marginTop: 24 }}>
          <FooterLink />
        </div>
      </div>
    </div>
  );
}

export default Home;
