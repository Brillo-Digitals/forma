"use client";

import { useState } from "react";
import { FreeformElement } from "@/types";

interface Props {
  el: FreeformElement;
  children: React.ReactNode;
  isEditing?: boolean;
}

export default function LinkWrapper({ el, children, isEditing = false }: Props) {
  const [hovered, setHovered] = useState(false);

  if (!el.link) return <>{children}</>;

  const { type, value, openInNewTab, underline, color, hoverColor, hoverUnderline } = el.link;

  let href = "#";
  if (type === "url") href = value;
  else if (type === "email") href = `mailto:${value}`;
  else if (type === "phone") href = `tel:${value}`;
  else if (type === "section") href = `#${value}`;

  return (
    <a
      href={href}
      target={openInNewTab ? "_blank" : "_self"}
      rel={openInNewTab ? "noopener noreferrer" : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => {
        if (isEditing) { e.preventDefault(); return; }
        if (type === "section") {
          e.preventDefault();
          const target = document.getElementById(value);
          if (target) target.scrollIntoView({ behavior: "smooth" });
        }
      }}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        color: hovered ? (hoverColor || color || "inherit") : (color || "inherit"),
        textDecoration: hovered
          ? (hoverUnderline ? "underline" : "none")
          : (underline ? "underline" : "none"),
      }}
    >
      {children}
    </a>
  );
}
