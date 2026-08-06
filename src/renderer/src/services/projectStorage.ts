import type {
  Camera,
  Wall,
} from "../components/designer/types";

export const SITEFORGE_PROJECT_VERSION = "0.7.1";

export const SITEFORGE_STORAGE_KEY =
  "siteforge.currentProject";

export interface SiteForgeProjectData {
  format: "siteforge-project";
  version: string;

  project: {
    id: string;
    name: string;

    customerName: string;
    siteAddress: string;

    createdAt: string;
    updatedAt: string;
  };

  drawing: {
    walls: Wall[];
    cameras: Camera[];

    viewport: {
      zoom: number;
      offsetX: number;
      offsetY: number;
    };
  };
}

interface CreateProjectDataInput {
  projectId?: string;
  projectName?: string;

  customerName?: string;
  siteAddress?: string;

  createdAt?: string;

  walls: Wall[];
  cameras: Camera[];

  zoom: number;
  offsetX: number;
  offsetY: number;
}

function cloneWalls(walls: Wall[]): Wall[] {
  return walls.map((wall) => ({
    ...wall,

    start: {
      ...wall.start,
    },

    end: {
      ...wall.end,
    },

    selected: false,
  }));
}

function cloneCameras(
  cameras: Camera[],
): Camera[] {
  return cameras.map((camera) => ({
    ...camera,

    position: {
      ...camera.position,
    },

    selected: false,
  }));
}

function createProjectId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `project-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
}

export function createProjectData({
  projectId,
  projectName = "Untitled Site",
  customerName = "",
  siteAddress = "",
  createdAt,

  walls,
  cameras,

  zoom,
  offsetX,
  offsetY,
}: CreateProjectDataInput): SiteForgeProjectData {
  const timestamp = new Date().toISOString();

  return {
    format: "siteforge-project",

    version: SITEFORGE_PROJECT_VERSION,

    project: {
      id: projectId ?? createProjectId(),

      name:
        projectName.trim() ||
        "Untitled Site",

      customerName:
        customerName.trim(),

      siteAddress:
        siteAddress.trim(),

      createdAt:
        createdAt ?? timestamp,

      updatedAt: timestamp,
    },

    drawing: {
      walls: cloneWalls(walls),

      cameras: cloneCameras(cameras),

      viewport: {
        zoom,
        offsetX,
        offsetY,
      },
    },
  };
}

export function validateProjectData(
  value: unknown,
): value is SiteForgeProjectData {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const projectData =
    value as Partial<SiteForgeProjectData>;

  if (
    projectData.format !==
    "siteforge-project"
  ) {
    return false;
  }

  if (
    typeof projectData.version !==
    "string"
  ) {
    return false;
  }

  if (
    typeof projectData.project !==
      "object" ||
    projectData.project === null
  ) {
    return false;
  }

  if (
    typeof projectData.drawing !==
      "object" ||
    projectData.drawing === null
  ) {
    return false;
  }

  const project =
    projectData.project as Partial<
      SiteForgeProjectData["project"]
    >;

  const drawing =
    projectData.drawing as Partial<
      SiteForgeProjectData["drawing"]
    >;

  if (
    typeof project.id !== "string" ||
    typeof project.name !== "string" ||
    typeof project.createdAt !==
      "string" ||
    typeof project.updatedAt !==
      "string"
  ) {
    return false;
  }

  if (
    !Array.isArray(drawing.walls) ||
    !Array.isArray(drawing.cameras)
  ) {
    return false;
  }

  if (
    typeof drawing.viewport !==
      "object" ||
    drawing.viewport === null
  ) {
    return false;
  }

  const viewport =
    drawing.viewport as Partial<
      SiteForgeProjectData["drawing"]["viewport"]
    >;

  return (
    typeof viewport.zoom === "number" &&
    typeof viewport.offsetX ===
      "number" &&
    typeof viewport.offsetY ===
      "number"
  );
}

export function saveProjectLocally(
  projectData: SiteForgeProjectData,
): void {
  const serialized =
    JSON.stringify(projectData);

  localStorage.setItem(
    SITEFORGE_STORAGE_KEY,
    serialized,
  );
}

export function loadProjectLocally():
  | SiteForgeProjectData
  | null {
  const serialized =
    localStorage.getItem(
      SITEFORGE_STORAGE_KEY,
    );

  if (!serialized) {
    return null;
  }

  try {
    const parsed: unknown =
      JSON.parse(serialized);

    if (!validateProjectData(parsed)) {
      console.error(
        "Stored SiteForge project is invalid.",
      );

      return null;
    }

    return parsed;
  } catch (error) {
    console.error(
      "Could not read stored SiteForge project.",
      error,
    );

    return null;
  }
}

export function deleteLocalProject(): void {
  localStorage.removeItem(
    SITEFORGE_STORAGE_KEY,
  );
}

export function projectExistsLocally(): boolean {
  return (
    localStorage.getItem(
      SITEFORGE_STORAGE_KEY,
    ) !== null
  );
}

export function exportProjectAsJson(
  projectData: SiteForgeProjectData,
): string {
  return JSON.stringify(
    projectData,
    null,
    2,
  );
}

export function importProjectFromJson(
  json: string,
): SiteForgeProjectData {
  let parsed: unknown;

  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error(
      "The selected file does not contain valid JSON.",
    );
  }

  if (!validateProjectData(parsed)) {
    throw new Error(
      "The selected file is not a valid SiteForge project.",
    );
  }

  return parsed;
}

export function createSafeFilename(
  projectName: string,
): string {
  const safeName = projectName
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  return `${
    safeName || "siteforge-project"
  }.siteforge`;
}
