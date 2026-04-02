import { SectionProps } from "@/types";

const PUBLISH_KEY_PREFIX = "forma_published_";

export interface PublishResult {
  id: string;
  url: string;
}

export async function publishPage(
  userId: string,
  projectId: string,
  html: string
): Promise<PublishResult> {
  // Dummy mode: save to localStorage and return a /published/[id] route
  const publishId = projectId || `${userId}_${Date.now()}`;
  const key = `${PUBLISH_KEY_PREFIX}${publishId}`;

  try {
    localStorage.setItem(key, html);
  } catch (e) {
    // localStorage quota exceeded - try compressing (just truncate for demo)
    console.warn("localStorage quota issue:", e);
  }

  const url = `${window.location.origin}/published/${publishId}`;
  return { id: publishId, url };
}

export function getPublishedPage(publishId: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(`${PUBLISH_KEY_PREFIX}${publishId}`);
}
