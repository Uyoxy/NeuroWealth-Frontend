"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Settings } from "lucide-react";
import { commandPaletteRoutes } from "@/lib/routeMetadata";
import { cn } from "@/lib/utils";

type Command = {
  id: string;
  name: string;
  icon: React.ElementType;
  action: () => void;
};

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const mockActions = [
    { id: "action-logout", name: "Mock: Logout", action: () => alert("Logged Out") },
    { id: "action-theme", name: "Mock: Toggle Theme", action: () => alert("Theme Toggled") },
  ];

  const allCommands: Command[] = [
    ...commandPaletteRoutes.map((route) => ({
      ...route,
      action: () => {
        router.push(route.path);
        setIsOpen(false);
      },
    })),
    ...mockActions.map((action) => ({
      ...action,
      icon: Settings,
      action: () => {
        action.action();
        setIsOpen(false);
      },
    })),
  ];

  const filteredCommands = allCommands.filter((command) =>
    command.name.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (listRef.current && isOpen && filteredCommands.length > 0) {
      const activeElement = listRef.current.children[selectedIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex, isOpen, filteredCommands.length]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (filteredCommands.length === 0) {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = filteredCommands[selectedIndex];
      if (selected) {
        selected.action();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center px-0 pt-[10vh] sm:px-4 sm:pt-[20vh]">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command Palette"
        className="relative w-full max-w-full overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl animate-in fade-in zoom-in-95 duration-200 sm:max-w-[640px] sm:rounded-xl"
      >
        <div className="flex min-h-[56px] items-center border-b border-slate-800 px-4">
          <Search className="mr-3 h-5 w-5 shrink-0 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search routes and actions... (Cmd+K)"
            className="flex-1 border-none bg-transparent pt-[1px] text-slate-200 outline-none placeholder:text-slate-500"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-autocomplete="list"
            aria-controls="command-palette-results"
            aria-activedescendant={
              filteredCommands[selectedIndex] ? filteredCommands[selectedIndex].id : undefined
            }
          />
        </div>

        <ul
          id="command-palette-results"
          ref={listRef}
          role="listbox"
          className="max-h-[300px] overflow-y-auto p-2 sm:max-h-[400px]"
        >
          {filteredCommands.length === 0 && (
            <li className="p-4 text-center text-sm text-slate-500">
              No results found for &quot;{query}&quot;
            </li>
          )}
          {filteredCommands.map((command, index) => {
            const isSelected = index === selectedIndex;
            return (
              <li
                key={command.id}
                id={command.id}
                role="option"
                aria-selected={isSelected}
                className={cn(
                  "flex min-h-[44px] cursor-pointer items-center rounded-md px-4 py-2 text-sm transition-colors",
                  isSelected
                    ? "bg-slate-800 text-sky-400"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200",
                )}
                onClick={() => command.action()}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <command.icon className="mr-3 h-4 w-4 shrink-0" />
                <span>{command.name}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
