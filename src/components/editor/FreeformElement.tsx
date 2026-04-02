"use client";

import React, { memo, useRef, useEffect, useCallback } from "react";
import { FreeformElement as FreeformElementType, ElementStyle } from "@/types";
import { useBuilderStore } from "@/store/builderStore";
import LinkWrapper from "./LinkWrapper";

const SNAP = 10;
const MIN_W = 50;
const MIN_H = 30;

type Handle = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";

const HANDLE_POSITIONS: Record<Handle, React.CSSProperties> = {
  nw: { top: -5, left: -5, cursor: "nw-resize" },
  n:  { top: -5, left: "50%", transform: "translateX(-50%)", cursor: "n-resize" },
  ne: { top: -5, right: -5, cursor: "ne-resize" },
  e:  { top: "50%", right: -5, transform: "translateY(-50%)", cursor: "e-resize" },
  se: { bottom: -5, right: -5, cursor: "se-resize" },
  s:  { bottom: -5, left: "50%", transform: "translateX(-50%)", cursor: "s-resize" },
  sw: { bottom: -5, left: -5, cursor: "sw-resize" },
  w:  { top: "50%", left: -5, transform: "translateY(-50%)", cursor: "w-resize" },
};

interface Props {
  el: FreeformElementType;
  sectionId: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

function FreeformElementComponent({ el, sectionId, containerRef }: Props) {
  const { selectedElementId, selectedSectionForElement, currentViewport, updateElement, selectElement } = useBuilderStore();
  const isSelected = selectedElementId === el.id && selectedSectionForElement === sectionId;

  const viewport = currentViewport || "desktop";
  const baseStyle = el.style.desktop;
  const vpOverride = viewport !== "desktop" ? (el.style[viewport] || {}) : {};
  const s: ElementStyle = { ...baseStyle, ...vpOverride };

  const elRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; initTop: number; initLeft: number; active: boolean } | null>(null);
  const resizeRef = useRef<{ startX: number; startY: number; initW: number; initH: number; initTop: number; initLeft: number; handle: Handle; active: boolean } | null>(null);

  const commitPosition = useCallback(() => {
    if (!elRef.current) return;
    const newLeft = parseFloat(elRef.current.style.left);
    const newTop  = parseFloat(elRef.current.style.top);
    const newW    = parseFloat(elRef.current.style.width);
    const newH    = parseFloat(elRef.current.style.height);
    updateElement(sectionId, el.id, {
      style: { ...el.style, [viewport]: { ...s, left: newLeft, top: newTop, width: newW, height: newH } },
    });
  }, [el, sectionId, viewport, s, updateElement]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (dragRef.current?.active && elRef.current) {
        const container = containerRef.current;
        const dx = e.clientX - dragRef.current.startX;
        const dy = e.clientY - dragRef.current.startY;
        const cW = container ? container.offsetWidth  : 9999;
        const cH = container ? container.offsetHeight : 9999;
        let nx = Math.round((dragRef.current.initLeft + dx) / SNAP) * SNAP;
        let ny = Math.round((dragRef.current.initTop  + dy) / SNAP) * SNAP;
        nx = Math.max(0, Math.min(nx, cW - s.width));
        ny = Math.max(0, Math.min(ny, cH - s.height));
        elRef.current.style.left = `${nx}px`;
        elRef.current.style.top  = `${ny}px`;
      }
      if (resizeRef.current?.active && elRef.current) {
        const r = resizeRef.current;
        const dx = e.clientX - r.startX;
        const dy = e.clientY - r.startY;
        let nW = r.initW, nH = r.initH, nL = r.initLeft, nT = r.initTop;
        if (r.handle.includes("e")) nW = r.initW + dx;
        if (r.handle.includes("w")) { nW = r.initW - dx; nL = r.initLeft + dx; }
        if (r.handle.includes("s")) nH = r.initH + dy;
        if (r.handle.includes("n")) { nH = r.initH - dy; nT = r.initTop + dy; }
        nW = Math.max(MIN_W, nW); nH = Math.max(MIN_H, nH);
        elRef.current.style.width  = `${nW}px`;
        elRef.current.style.height = `${nH}px`;
        elRef.current.style.left   = `${nL}px`;
        elRef.current.style.top    = `${nT}px`;
      }
    };
    const onUp = () => {
      if (dragRef.current?.active || resizeRef.current?.active) { commitPosition(); }
      dragRef.current = null;
      resizeRef.current = null;
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => { document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); };
  }, [commitPosition, s.width, s.height]);

  const onDragStart = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).dataset.handle) return;
    e.preventDefault(); e.stopPropagation();
    selectElement(sectionId, el.id);
    dragRef.current = { startX: e.clientX, startY: e.clientY, initTop: s.top, initLeft: s.left, active: true };
  };

  const onResizeStart = (e: React.MouseEvent, handle: Handle) => {
    e.preventDefault(); e.stopPropagation();
    resizeRef.current = { startX: e.clientX, startY: e.clientY, initW: s.width, initH: s.height, initTop: s.top, initLeft: s.left, handle, active: true };
  };

  const renderContent = () => {
    const baseTextStyle: React.CSSProperties = {
      fontSize: s.fontSize || 16, fontWeight: s.fontWeight || "400",
      color: s.color || "#2A2A2A", textAlign: s.textAlign || "left",
      fontFamily: s.fontFamily || "inherit", letterSpacing: s.letterSpacing,
      lineHeight: s.lineHeight || "1.5", padding: s.padding || "4px",
      width: "100%", height: "100%", boxSizing: "border-box" as const,
    };

    switch (el.type) {
      case "text":
        return (
          <div
            contentEditable={isSelected}
            suppressContentEditableWarning
            onBlur={(e) => updateElement(sectionId, el.id, { content: e.currentTarget.textContent || "" })}
            style={{ ...baseTextStyle, outline: "none", cursor: isSelected ? "text" : "inherit" }}
          >
            {el.content || "Edit this text"}
          </div>
        );
      case "button":
        return (
          <button style={{
            width: "100%", height: "100%", cursor: "pointer",
            backgroundColor: s.backgroundColor || "#7A2535", color: s.color || "#fff",
            fontSize: s.fontSize || 14, fontWeight: s.fontWeight || "500",
            border: s.border || "none", borderRadius: s.borderRadius || 2,
            padding: s.padding || "10px 24px", fontFamily: "inherit",
            boxShadow: s.boxShadow || "none",
          }}>
            {el.content || "Click Me"}
          </button>
        );
      case "image":
        return el.src ? (
          <img src={el.src} alt={el.content || ""} draggable={false}
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: s.borderRadius || 0, display: "block" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", backgroundColor: "#f0ede8", display: "flex", alignItems: "center", justifyContent: "center", color: "#999", fontSize: 13, border: "2px dashed #ddd", borderRadius: s.borderRadius || 0 }}>
            🖼 Drop image URL in panel
          </div>
        );
      case "container":
        return (
          <div style={{ width: "100%", height: "100%", backgroundColor: s.backgroundColor || "transparent", border: s.border || "1px solid #E0DBD4", borderRadius: s.borderRadius || 0 }} />
        );
    }
  };

  return (
    <div
      ref={elRef}
      onMouseDown={onDragStart}
      onClick={(e) => { e.stopPropagation(); selectElement(sectionId, el.id); }}
      style={{
        position: "absolute",
        top: s.top, left: s.left, width: s.width, height: s.height,
        zIndex: s.zIndex || 1,
        opacity: s.opacity !== undefined ? s.opacity : 1,
        cursor: "move", userSelect: "none", boxSizing: "border-box",
        outline: isSelected ? "2px solid #7A2535" : "none",
      }}
    >
      <LinkWrapper el={el} isEditing>
        {renderContent()}
      </LinkWrapper>

      {isSelected && (Object.keys(HANDLE_POSITIONS) as Handle[]).map((h) => (
        <div
          key={h}
          data-handle={h}
          onMouseDown={(e) => onResizeStart(e, h)}
          style={{
            position: "absolute", width: 9, height: 9,
            backgroundColor: "white", border: "2px solid #7A2535",
            borderRadius: 1, zIndex: 999,
            ...HANDLE_POSITIONS[h],
          }}
        />
      ))}
    </div>
  );
}

export default memo(FreeformElementComponent);
