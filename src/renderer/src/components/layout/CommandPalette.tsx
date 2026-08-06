import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type KeyboardEvent,
} from "react";

import {
  Camera,
  DoorOpen,
  FileText,
  FolderOpen,
  MousePointer2,
  Redo2,
  Ruler,
  Save,
  Search,
  Settings,
  Square,
  Undo2,
  X,
} from "lucide-react";

import { useDesignerStore } from "../../store/designerStore";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  label: string;
  description: string;
  keywords: string[];
  shortcut?: string;
  icon: ComponentType<{
    size?: number;
    strokeWidth?: number;
  }>;
  action: () => void;
  disabled?: boolean;
}

export default function CommandPalette({
  open,
  onClose,
}: CommandPaletteProps) {
  const inputRef =
    useRef<HTMLInputElement>(null);

  const [search, setSearch] =
    useState("");

  const [selectedIndex, setSelectedIndex] =
    useState(0);

  const setTool = useDesignerStore(
    (state) => state.setTool,
  );

  const undo = useDesignerStore(
    (state) => state.undo,
  );

  const redo = useDesignerStore(
    (state) => state.redo,
  );

  const pastCount = useDesignerStore(
    (state) => state.past.length,
  );

  const futureCount = useDesignerStore(
    (state) => state.future.length,
  );

  const clearSelection = useDesignerStore(
    (state) => state.clearSelection,
  );

  const commands = useMemo<CommandItem[]>(
    () => [
      {
        id: "tool-select",
        label: "Activate Select Tool",
        description:
          "Select, move and edit objects",
        keywords: [
          "select",
          "pointer",
          "move",
          "edit",
          "tool",
        ],
        shortcut: "V",
        icon: MousePointer2,
        action: () => {
          setTool("select");
          clearSelection();
        },
      },
      {
        id: "tool-wall",
        label: "Activate Wall Tool",
        description:
          "Draw walls on the design canvas",
        keywords: [
          "wall",
          "draw",
          "building",
          "line",
          "tool",
        ],
        shortcut: "W",
        icon: Square,
        action: () => {
          setTool("wall");
        },
      },
      {
        id: "tool-door",
        label: "Activate Door Tool",
        description:
          "Place doors on the design",
        keywords: [
          "door",
          "entrance",
          "opening",
          "tool",
        ],
        shortcut: "D",
        icon: DoorOpen,
        action: () => {
          setTool("door");
        },
      },
      {
        id: "tool-camera",
        label: "Activate Camera Tool",
        description:
          "Place CCTV cameras on the canvas",
        keywords: [
          "camera",
          "cctv",
          "device",
          "coverage",
          "tool",
        ],
        shortcut: "C",
        icon: Camera,
        action: () => {
          setTool("camera");
        },
      },
      {
        id: "undo",
        label: "Undo Last Change",
        description:
          "Restore the previous project state",
        keywords: [
          "undo",
          "back",
          "history",
          "restore",
        ],
        shortcut: "Ctrl+Z",
        icon: Undo2,
        disabled: pastCount === 0,
        action: undo,
      },
      {
        id: "redo",
        label: "Redo Last Change",
        description:
          "Restore the next project state",
        keywords: [
          "redo",
          "forward",
          "history",
        ],
        shortcut: "Ctrl+Y",
        icon: Redo2,
        disabled: futureCount === 0,
        action: redo,
      },
      {
        id: "save",
        label: "Save Project",
        description:
          "Save the current SiteForge project",
        keywords: [
          "save",
          "project",
          "file",
          "disk",
        ],
        shortcut: "Ctrl+S",
        icon: Save,
        action: () => {
          window.alert(
            "Project saving will be connected to the new SiteForge project system next.",
          );
        },
      },
      {
        id: "open",
        label: "Open Project",
        description:
          "Open an existing SiteForge project",
        keywords: [
          "open",
          "load",
          "project",
          "file",
        ],
        shortcut: "Ctrl+O",
        icon: FolderOpen,
        action: () => {
          window.alert(
            "Project opening will be connected to the new SiteForge project system next.",
          );
        },
      },
      {
        id: "measure",
        label: "Measurement Tools",
        description:
          "Open drawing measurement tools",
        keywords: [
          "measure",
          "distance",
          "dimension",
          "ruler",
        ],
        shortcut: "M",
        icon: Ruler,
        action: () => {
          window.alert(
            "Measurement tools are coming in a future sprint.",
          );
        },
      },
      {
        id: "quote",
        label: "Generate Quote",
        description:
          "Create a quotation from the current design",
        keywords: [
          "quote",
          "quotation",
          "price",
          "commercial",
          "proposal",
        ],
        icon: FileText,
        action: () => {
          window.alert(
            "The SiteForge quotation engine is coming soon.",
          );
        },
      },
      {
        id: "settings",
        label: "Application Settings",
        description:
          "Configure SiteForge preferences",
        keywords: [
          "settings",
          "preferences",
          "configuration",
        ],
        icon: Settings,
        action: () => {
          window.alert(
            "Application settings are coming soon.",
          );
        },
      },
    ],
    [
      clearSelection,
      futureCount,
      pastCount,
      redo,
      setTool,
      undo,
    ],
  );

  const filteredCommands = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    if (!normalizedSearch) {
      return commands;
    }

    return commands.filter((command) => {
      const searchableText = [
        command.label,
        command.description,
        command.shortcut ?? "",
        ...command.keywords,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(
        normalizedSearch,
      );
    });
  }, [commands, search]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setSearch("");
    setSelectedIndex(0);

    window.setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  const runCommand = (
    command: CommandItem,
  ) => {
    if (command.disabled) {
      return;
    }

    command.action();
    onClose();
  };

  const handleInputKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      setSelectedIndex((current) => {
        if (
          filteredCommands.length === 0
        ) {
          return 0;
        }

        return (
          (current + 1) %
          filteredCommands.length
        );
      });

      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setSelectedIndex((current) => {
        if (
          filteredCommands.length === 0
        ) {
          return 0;
        }

        return (
          current -
            1 +
            filteredCommands.length
        ) % filteredCommands.length;
      });

      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();

      const command =
        filteredCommands[selectedIndex];

      if (command) {
        runCommand(command);
      }
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div
      role="presentation"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 5000,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "12vh",
        background:
          "rgba(5, 7, 10, 0.72)",
        backdropFilter: "blur(7px)",
      }}
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command Palette"
        style={{
          width: "min(680px, 92vw)",
          maxHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          background: "#15191f",
          border: "1px solid #3a424f",
          borderRadius: 13,
          boxShadow:
            "0 30px 90px rgba(0, 0, 0, 0.62)",
          color: "#ffffff",
          fontFamily:
            "Segoe UI, sans-serif",
        }}
      >
        <div
          style={{
            height: 58,
            display: "flex",
            alignItems: "center",
            gap: 11,
            padding: "0 15px",
            borderBottom:
              "1px solid #303641",
            background: "#1b2027",
          }}
        >
          <Search
            size={20}
            color="#39ff14"
          />

          <input
            ref={inputRef}
            type="text"
            value={search}
            placeholder="Search SiteForge commands..."
            onChange={(event) =>
              setSearch(event.target.value)
            }
            onKeyDown={
              handleInputKeyDown
            }
            style={{
              flex: 1,
              minWidth: 0,
              background: "transparent",
              color: "#ffffff",
              border: "none",
              outline: "none",
              fontSize: 15,
            }}
          />

          <button
            type="button"
            onClick={onClose}
            title="Close"
            style={{
              width: 34,
              height: 34,
              display: "grid",
              placeItems: "center",
              border: "1px solid #343b47",
              borderRadius: 7,
              background: "#232831",
              color: "#9ca6b3",
              cursor: "pointer",
            }}
          >
            <X size={17} />
          </button>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 8,
          }}
        >
          {filteredCommands.length ===
          0 ? (
            <div
              style={{
                padding: 36,
                textAlign: "center",
                color: "#747f8d",
                fontSize: 13,
              }}
            >
              No matching commands found.
            </div>
          ) : (
            filteredCommands.map(
              (command, index) => {
                const Icon =
                  command.icon;

                const selected =
                  index === selectedIndex;

                return (
                  <button
                    key={command.id}
                    type="button"
                    disabled={
                      command.disabled
                    }
                    onMouseEnter={() =>
                      setSelectedIndex(index)
                    }
                    onClick={() =>
                      runCommand(command)
                    }
                    style={{
                      width: "100%",
                      minHeight: 58,
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "8px 11px",
                      marginBottom: 4,
                      background: selected
                        ? "#232a33"
                        : "transparent",
                      color:
                        command.disabled
                          ? "#59616d"
                          : "#ffffff",
                      border: selected
                        ? "1px solid #46505f"
                        : "1px solid transparent",
                      borderRadius: 8,
                      cursor:
                        command.disabled
                          ? "not-allowed"
                          : "pointer",
                      textAlign: "left",
                      opacity:
                        command.disabled
                          ? 0.55
                          : 1,
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        flexShrink: 0,
                        display: "grid",
                        placeItems:
                          "center",
                        borderRadius: 8,
                        background: selected
                          ? "#173619"
                          : "#20252d",
                        border: selected
                          ? "1px solid #2f7a34"
                          : "1px solid #343b47",
                        color: selected
                          ? "#39ff14"
                          : "#aeb7c2",
                      }}
                    >
                      <Icon
                        size={18}
                        strokeWidth={2}
                      />
                    </div>

                    <div
                      style={{
                        minWidth: 0,
                        flex: 1,
                      }}
                    >
                      <div
                        style={{
                          color:
                            command.disabled
                              ? "#68717d"
                              : "#ffffff",
                          fontSize: 13,
                          fontWeight: 800,
                        }}
                      >
                        {command.label}
                      </div>

                      <div
                        style={{
                          marginTop: 3,
                          overflow:
                            "hidden",
                          color: "#747f8d",
                          fontSize: 10,
                          textOverflow:
                            "ellipsis",
                          whiteSpace:
                            "nowrap",
                        }}
                      >
                        {
                          command.description
                        }
                      </div>
                    </div>

                    {command.shortcut && (
                      <div
                        style={{
                          flexShrink: 0,
                          padding:
                            "4px 7px",
                          background:
                            "#111419",
                          border:
                            "1px solid #343b47",
                          borderRadius: 5,
                          color: "#9ca6b3",
                          fontSize: 9,
                          fontWeight: 800,
                        }}
                      >
                        {
                          command.shortcut
                        }
                      </div>
                    )}
                  </button>
                );
              },
            )
          )}
        </div>

        <footer
          style={{
            minHeight: 36,
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            gap: 12,
            padding: "0 13px",
            borderTop:
              "1px solid #303641",
            background: "#111419",
            color: "#68717d",
            fontSize: 9,
          }}
        >
          <span>
            ↑ ↓ Navigate · Enter Run ·
            Esc Close
          </span>

          <span>
            SiteForge Command Centre
          </span>
        </footer>
      </div>
    </div>
  );
}
