import React from "react";

const FooterLink = ({ title, links = [] }) => {
  return (
    <div style={{ marginBottom: 20 }}>
      <h4 style={{ color: "#fff", fontWeight: 800, marginBottom: 12 }}>
        {title}
      </h4>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "grid",
          gap: 8,
        }}
      >
        {links.map((l, i) => (
          <li key={i}>
            <a
              href={l.href || "#"}
              style={{
                color: "rgba(255,255,255,0.75)",
                textDecoration: "none",
                fontSize: 14,
              }}
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FooterLink;
