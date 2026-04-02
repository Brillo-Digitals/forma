"use client";

import React, { memo, useRef, useEffect, useCallback, useMemo } from "react";
import { FreeformElement as FreeformElementType, ElementStyle } from "@/types";
import { useBuilderStore } from "@/store/builderStore";
import LinkWrapper from "./LinkWrapper";
import { AlignmentGuide } from "./FreeformLayer";

const SNAP = 10;
const MIN_W = 50;
const MIN_H = 30;
const ALIGN_THRESHOLD = 4;

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
  allElements: FreeformElementType[];
  onGuidesChange: (guides: AlignmentGuide[]) => void;
}

function FreeformElementComponent({ el, sectionId, containerRef, allElements, onGuidesChange }: Props) {
  const { selectedElementId, selectedSectionForElement, currentViewport, updateElement, selectElement } = useBuilderStore();
  const isSelected = selectedElementId === el.id && selectedSectionForElement === sectionId;

  const viewport = currentViewport || "desktop";
  const s: ElementStyle = useMemo(() => {
    const baseStyle = el.style.desktop;
    const vpOverride = viewport !== "desktop" ? (el.style[viewport] || {}) : {};
    return { ...baseStyle, ...vpOverride };
  }, [el.style, viewport]);

  const elRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; initTop: number; initLeft: number; active: boolean } | null>(null);
  const resizeRef = useRef<{ startX: number; startY: number; initW: number; initH: number; initTop: number; initLeft: number; handle: Handle; active: boolean } | null>(null);

  const getComputedElementStyle = useCallback((item: FreeformElementType): ElementStyle => {
    const base = item.style.desktop;
    const override = viewport !== "desktop" ? (item.style[viewport] || {}) : {};
    return { ...base, ...override };
  }, [viewport]);

  const maybeAlignValue = useCallback((current: number, target: number) => {
    return Math.abs(current - target) <= ALIGN_THRESHOLD ? target : current;
  }, []);

  const computeDragAlignment = useCallback((nextLeft: number, nextTop: number, cW: number, cH: number) => {
    let alignedLeft = nextLeft;
    let alignedTop = nextTop;
    const guides: AlignmentGuide[] = [];

    const width = s.width;
    const height = s.height;

    const pushGuide = (axis: "x" | "y", position: number) => {
      if (!guides.some((g) => g.axis === axis && Math.abs(g.position - position) < 0.5)) {
        guides.push({ axis, position });
      }
    };

    const containerCenterX = cW / 2;
    const containerCenterY = cH / 2;
    const centerX = alignedLeft + width / 2;
    const centerY = alignedTop + height / 2;

    if (Math.abs(centerX - containerCenterX) <= ALIGN_THRESHOLD) {
      alignedLeft = containerCenterX - width / 2;
      pushGuide("x", containerCenterX);
    }
    if (Math.abs(centerY - containerCenterY) <= ALIGN_THRESHOLD) {
      alignedTop = containerCenterY - height / 2;
      pushGuide("y", containerCenterY);
    }

    allElements.forEach((other) => {
      if (other.id === el.id) return;

      const os = getComputedElementStyle(other);
      const otherLeft = os.left;
      const otherRight = os.left + os.width;
      const otherCenterX = os.left + os.width / 2;
      const otherTop = os.top;
      const otherBottom = os.top + os.height;
      const otherCenterY = os.top + os.height / 2;

      const nextRight = alignedLeft + width;
      const nextCenterX = alignedLeft + width / 2;
      const nextBottom = alignedTop + height;
      const nextCenterY = alignedTop + height / 2;

      const candidateLeft = maybeAlignValue(alignedLeft, otherLeft);
      if (candidateLeft !== alignedLeft) {
        alignedLeft = candidateLeft;
        pushGuide("x", otherLeft);
      }

      const candidateRight = maybeAlignValue(nextRight, otherRight);
      if (candidateRight !== nextRight) {
        alignedLeft = otherRight - width;
        pushGuide("x", otherRight);
      }

      const candidateCenterX = maybeAlignValue(nextCenterX, otherCenterX);
      if (candidateCenterX !== nextCenterX) {
        alignedLeft = otherCenterX - width / 2;
        pushGuide("x", otherCenterX);
      }

      const candidateTop = maybeAlignValue(alignedTop, otherTop);
      if (candidateTop !== alignedTop) {
        alignedTop = candidateTop;
        pushGuide("y", otherTop);
      }

      const candidateBottom = maybeAlignValue(nextBottom, otherBottom);
      if (candidateBottom !== nextBottom) {
        alignedTop = otherBottom - height;
        pushGuide("y", otherBottom);
      }

      const candidateCenterY = maybeAlignValue(nextCenterY, otherCenterY);
      if (candidateCenterY !== nextCenterY) {
        alignedTop = otherCenterY - height / 2;
        pushGuide("y", otherCenterY);
      }
    });

    return { left: alignedLeft, top: alignedTop, guides };
  }, [allElements, el.id, getComputedElementStyle, maybeAlignValue, s.height, s.width]);

  const snapResizeHeightToPeers = useCallback((nextHeight: number) => {
    let snapped = nextHeight;
    const guides: AlignmentGuide[] = [];

    allElements.forEach((other) => {
      if (other.id === el.id) return;
      const os = getComputedElementStyle(other);
      if (Math.abs(snapped - os.height) <= ALIGN_THRESHOLD) {
        snapped = os.height;
        guides.push({ axis: "y", position: s.top + snapped });
      }
    });

    return { height: snapped, guides };
  }, [allElements, el.id, getComputedElementStyle, s.top]);

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

        const aligned = computeDragAlignment(nx, ny, cW, cH);
        nx = Math.max(0, Math.min(aligned.left, cW - s.width));
        ny = Math.max(0, Math.min(aligned.top, cH - s.height));

        onGuidesChange(aligned.guides);
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

        const snappedHeight = snapResizeHeightToPeers(nH);
        nH = snappedHeight.height;

        const resizeGuides: AlignmentGuide[] = [...snappedHeight.guides];
        resizeGuides.push({ axis: "x", position: nL });
        resizeGuides.push({ axis: "y", position: nT });
        onGuidesChange(resizeGuides);

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
      onGuidesChange([]);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => { document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); };
  }, [commitPosition, computeDragAlignment, onGuidesChange, s.width, s.height, snapResizeHeightToPeers, containerRef]);

  const onDragStart = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).dataset.handle) return;
    e.preventDefault(); e.stopPropagation();
    selectElement(sectionId, el.id);
    dragRef.current = { startX: e.clientX, startY: e.clientY, initTop: s.top, initLeft: s.left, active: true };
    onGuidesChange([]);
  };

  const onResizeStart = (e: React.MouseEvent, handle: Handle) => {
    e.preventDefault(); e.stopPropagation();
    resizeRef.current = { startX: e.clientX, startY: e.clientY, initW: s.width, initH: s.height, initTop: s.top, initLeft: s.left, handle, active: true };
    onGuidesChange([]);
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
