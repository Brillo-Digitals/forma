import { db, isDummyFirebase } from "./firebase";
import { collection, doc, setDoc, getDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";
import { SectionProps } from "@/types";

export interface ProjectDoc {
  id: string;
  title: string;
  sections: SectionProps[];
  createdAt: any;
  updatedAt: any;
  userId: string;
}

// LocalStorage Fallback implementation for when Firebase isn't configured
const LOCAL_STORAGE_KEY = "dummy_forma_projects";

function getLocalProjects(): ProjectDoc[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveLocalProjects(projects: ProjectDoc[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
  }
}

export async function saveProject(
  userId: string,
  title: string,
  sections: SectionProps[],
  existingId?: string | null
): Promise<string> {
  const projectId = existingId || `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  if (isDummyFirebase || !db) {
    // LocalStorage Fallback
    const projects = getLocalProjects();
    const existingIndex = projects.findIndex(p => p.id === projectId);
    
    const projectDoc: ProjectDoc = {
      id: projectId,
      title,
      sections,
      createdAt: existingIndex >= 0 ? projects[existingIndex].createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId
    };

    if (existingIndex >= 0) {
      projects[existingIndex] = projectDoc;
    } else {
      projects.push(projectDoc);
    }
    
    saveLocalProjects(projects);
    return projectId;
  }

  // Real Firebase Implementation
  const projRef = doc(db, "projects", projectId);
  await setDoc(projRef, {
    id: projectId,
    title,
    sections,
    userId,
    updatedAt: serverTimestamp(),
    ...(existingId ? {} : { createdAt: serverTimestamp() })
  }, { merge: true });

  return projectId;
}

export async function loadProject(projectId: string): Promise<ProjectDoc | null> {
  if (isDummyFirebase || !db) {
    const projects = getLocalProjects();
    return projects.find(p => p.id === projectId) || null;
  }

  const projRef = doc(db, "projects", projectId);
  const snap = await getDoc(projRef);

  if (snap.exists()) {
    return snap.data() as ProjectDoc;
  }
  return null;
}

export async function listProjects(userId: string): Promise<ProjectDoc[]> {
  if (isDummyFirebase || !db) {
    const projects = getLocalProjects();
    return projects.filter(p => p.userId === userId).sort((a, b) => {
      // Sort newest first
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }

  const projRef = collection(db, "projects");
  const q = query(projRef, where("userId", "==", userId));
  const snapshot = await getDocs(q);
  
  const projects: ProjectDoc[] = [];
  snapshot.forEach((doc: any) => {
    projects.push(doc.data() as ProjectDoc);
  });
  
  // Sort projects manually since we might not have a composite index for equality + sort yet
  return projects.sort((a, b) => {
    const timeA = a.updatedAt?.toMillis ? a.updatedAt.toMillis() : 0;
    const timeB = b.updatedAt?.toMillis ? b.updatedAt.toMillis() : 0;
    return timeB - timeA;
  });
}
