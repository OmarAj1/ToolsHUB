import React from "react";
import { LucideIcon } from "lucide-react";

export interface ToolCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  path: string;
  component?: React.ComponentType;
  icon?: string;
  isPopular?: boolean;
}

export interface Faq {
  question: string;
  answer: string;
}
