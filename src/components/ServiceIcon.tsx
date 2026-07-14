import React from "react";
import * as Lucide from "lucide-react";

interface ServiceIconProps {
  name: string;
  className?: string;
  size?: number;
}

export default function ServiceIcon({ name, className = "w-6 h-6", size }: ServiceIconProps) {
  // Safe fallback to Sparkles if icon name doesn't match
  const IconComponent = (Lucide as any)[name] || Lucide.Sparkles;
  return <IconComponent className={className} size={size} />;
}
