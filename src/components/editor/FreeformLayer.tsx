"use client";

import { useRef, useState } from "react";
import { FreeformElement as FreeformElementType } from "@/types";
import { useBuilderStore } from "@/store/builderStore";
import FreeformElementComponent from "./FreeformElement";

export interface AlignmentGuide {
  axis: "x" | "y";
  position: number;
}

interface Props {
  sectionId: string;
  elements: FreeformElementType[];
}

export default function FreeformLayer({ sectionId, elements }: Props) {
  const { selectElement, selectedSectionForElement } = useBuilderStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [guides, setGuides] = useState<AlignmentGuide[]>([]);

  if (!elements || elements.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      style={{ zIndex: 10, pointerEvents: "none" }}
      onClick={() => {
        if (selectedSectionForElement === sectionId) {
          selectElement(null, null);
          setGuides([]);
        }
      }}
    >
      {guides.map((guide, idx) => (
        <div
          key={`${guide.axis}-${guide.position}-${idx}`}
          className="absolute pointer-events-none"
          style={
            guide.axis === "x"
              ? {
                  left: `${guide.position}px`,
                  top: 0,
                  bottom: 0,
                  width: "1px",
                  backgroundColor: "rgba(122,37,53,0.45)",
                }
              : {
                  top: `${guide.position}px`,
                  left: 0,
                  right: 0,
                  height: "1px",
                  backgroundColor: "rgba(122,37,53,0.45)",
                }
          }
        />
      ))}

      {elements.map((el) => (
        <div key={el.id} style={{ pointerEvents: "auto" }}>
          <FreeformElementComponent
            el={el}
            sectionId={sectionId}
            containerRef={containerRef}
            allElements={elements}
            onGuidesChange={setGuides}
          />
        </div>
      ))}
    </div>
  );
}
