import React from "react";
import { TextToolBase } from "./TextToolBase";

export function RemoveDuplicateLines() {
  const process = (input: string) => {
    const lines = input.split('\n');
    return Array.from(new Set(lines)).join('\n');
  };
  return <TextToolBase title="Remove Duplicate Lines" description="Remove all duplicate lines from your text." actionButtonText="Remove Duplicates" onProcess={process} />;
}

export function SortLines() {
  const process = (input: string) => {
    const lines = input.split('\n');
    return lines.sort((a, b) => a.localeCompare(b)).join('\n');
  };
  return <TextToolBase title="Sort Lines" description="Sort lines alphabetically A-Z." actionButtonText="Sort Lines" onProcess={process} />;
}

export function ReverseLines() {
  const process = (input: string) => {
    const lines = input.split('\n');
    return lines.reverse().join('\n');
  };
  return <TextToolBase title="Reverse Lines" description="Reverse the order of lines." actionButtonText="Reverse Lines" onProcess={process} />;
}

export function CaseConverter() {
    const [mode, setMode] = React.useState("upper");
  
    const process = (input: string) => {
      if (mode === "upper") return input.toUpperCase();
      if (mode === "lower") return input.toLowerCase();
      if (mode === "title") {
          return input.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
      }
      if (mode === "sentence") {
          return input.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, c => c.toUpperCase());
      }
      return input;
    };
  
    const extraControls = (
      <select value={mode} onChange={(e) => setMode(e.target.value)} className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200">
        <option value="upper">UPPERCASE</option>
        <option value="lower">lowercase</option>
        <option value="title">Title Case</option>
        <option value="sentence">Sentence case.</option>
      </select>
    );

    return (
      <TextToolBase 
        title="Case Converter" 
        description="Convert text to different letter cases." 
        actionButtonText="Convert Case" 
        onProcess={process} 
        extraControls={extraControls} 
      />
    );
}

export function ExtractEmails() {
  const process = (input: string) => {
    const regex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const matches = input.match(regex) || [];
    return Array.from(new Set(matches)).join('\n');
  };
  return <TextToolBase title="Extract Emails" description="Extract all email addresses from text." actionButtonText="Extract Emails" onProcess={process} />;
}

export function ExtractUrls() {
  const process = (input: string) => {
    const regex = /(https?:\/\/[^\s]+)/g;
    const matches = input.match(regex) || [];
    return Array.from(new Set(matches)).join('\n');
  };
  return <TextToolBase title="Extract URLs" description="Extract all website links from text." actionButtonText="Extract URLs" onProcess={process} />;
}

export function RemoveEmptyLines() {
  const process = (input: string) => {
    return input.split('\n').filter(line => line.trim().length > 0).join('\n');
  };
  return <TextToolBase title="Remove Empty Lines" description="Remove all empty or whitespace-only lines." actionButtonText="Remove Empty Lines" onProcess={process} />;
}

export function WhitespaceRemover() {
    const process = (input: string) => {
      // Remove leading/trailing, reduce multiple spaces to single
      return input.split('\n').map(l => l.trim().replace(/\s+/g, ' ')).join('\n');
    };
    return <TextToolBase title="Whitespace Remover" description="Clean up extra spaces." actionButtonText="Remove Extra Spaces" onProcess={process} />;
}
