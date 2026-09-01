import {
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Tag, Typography } from "antd";
import { useTheme } from "../../context/ThemeProvider.jsx";

const { Title, Text } = Typography;

const assignments = [
  {
    time: "09:00",
    title: "Excavator handover",
    location: "Bole industrial area",
    status: "Ready",
  },
  {
    time: "13:30",
    title: "Site inspection",
    location: "Kazanchis project site",
    status: "Pending",
  },
  {
    time: "16:00",
    title: "Generator return check",
    location: "Akaki rental yard",
    status: "Pending",
  },
];

const OperatorDashboard = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const surface = isDark ? "#0d1b2d" : "#ffffff";
  const muted = isDark ? "#9db0c4" : "#617066";
  const text = isDark ? "#f8fafc" : "#16251b";

  return (
    <div className="operator-dashboard">
      <section className="operator-welcome">
        <div>
          <Text style={{ color: "#16803c", fontWeight: 700 }}>
            TUESDAY, SEPTEMBER 1
          </Text>
          <Title style={{ color: text }}>Your workday, at a glance.</Title>
          <Text style={{ color: muted }}>
            Stay on top of handovers, inspections, and rental deadlines.
          </Text>
        </div>
        <div className="operator-status-badge">
          <ThunderboltOutlined /> On duty
        </div>
      </section>

      <Row gutter={[16, 16]}>
        {[
          [
            "Assigned today",
            "3",
            <CalendarOutlined />,
            "Keep the schedule moving",
          ],
          [
            "Completed this week",
            "12",
            <ThunderboltOutlined />,
            "2 ahead of your target",
          ],
          [
            "Average response",
            "8 min",
            <ClockCircleOutlined />,
            "Excellent reliability",
          ],
        ].map(([label, value, icon, detail]) => (
          <Col xs={24} md={8} key={label}>
            <Card
              className="operator-stat-card"
              style={{
                background: surface,
                borderColor: isDark ? "#20344c" : "#dce8df",
              }}
            >
              <div className="operator-stat-icon">{icon}</div>
              <Text style={{ color: muted }}>{label}</Text>
              <Title level={2} style={{ color: text }}>
                {value}
              </Title>
              <Text style={{ color: muted }}>{detail}</Text>
            </Card>
          </Col>
        ))}
      </Row>

      <Card
        className="operator-schedule-card"
        style={{
          background: surface,
          borderColor: isDark ? "#20344c" : "#dce8df",
        }}
      >
        <div className="operator-section-heading">
          <div>
            <Title level={4} style={{ color: text }}>
              Today’s schedule
            </Title>
            <Text style={{ color: muted }}>Tuesday, September 1, 2026</Text>
          </div>
          <Tag color="green">3 assignments</Tag>
        </div>
        <div className="operator-assignment-list">
          {assignments.map((assignment) => (
            <div className="operator-assignment" key={assignment.title}>
              <Text strong style={{ color: "#16803c", minWidth: 52 }}>
                {assignment.time}
              </Text>
              <div className="operator-assignment-copy">
                <Text strong style={{ color: text }}>
                  {assignment.title}
                </Text>
                <Text style={{ color: muted }}>
                  <EnvironmentOutlined /> {assignment.location}
                </Text>
              </div>
              <Tag color={assignment.status === "Ready" ? "green" : "gold"}>
                {assignment.status}
              </Tag>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default OperatorDashboard;
