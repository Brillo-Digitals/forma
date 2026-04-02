"use client";

import { useRef } from "react";
import { FreeformElement as FreeformElementType } from "@/types";
import { useBuilderStore } from "@/store/builderStore";
import FreeformElementComponent from "./FreeformElement";

interface Props {
  sectionId: string;
  elements: FreeformElementType[];
}

export default function FreeformLayer({ sectionId, elements }: Props) {
  const { selectElement, selectedSectionForElement } = useBuilderStore();
  const containerRef = useRef<HTMLDivElement>(null);

  if (!elements || elements.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      style={{ zIndex: 10, pointerEvents: "none" }}
      onClick={() => {
        if (selectedSectionForElement === sectionId) {
          selectElement(null, null);
        }
      }}
    >
      {elements.map((el) => (
        <div key={el.id} style={{ pointerEvents: "auto" }}>
          <FreeformElementComponent
            el={el}
            sectionId={sectionId}
            containerRef={containerRef}
          />
        </div>
      ))}
    </div>
  );
}
