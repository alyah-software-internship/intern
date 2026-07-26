import DashboardShortcut from "../../component/home/DashboardShortcut.jsx";
import Hero from "../../component/home/Hero.jsx";
import Bookings from "../../component/home/Bookings.jsx";
import RecentlyViewed from "../../component/home/RecentlyViewed.jsx";
import AlertsPanel from "../../component/home/AlertsPanel.jsx";
import { Row, Col } from "antd";

function Home() {
  return (
    <div>
      <Hero />

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "24px" }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={14}>
            <DashboardShortcut />
            <Bookings />
          </Col>

          <Col xs={24} lg={10}>
            <AlertsPanel />
            <div style={{ marginTop: 16 }}>
              <RecentlyViewed />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Home;
