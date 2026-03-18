"use client";

import React from "react";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent?: string;
}

export default function StatsCard({
  label,
  value,
  icon,
  accent = "brand",
}: StatsCardProps) {
  const accentColors: Record<string, string> = {
    brand: "from-brand-500/20 to-brand-500/5 text-brand-400",
    emerald: "from-emerald-500/20 to-emerald-500/5 text-emerald-400",
    purple: "from-purple-500/20 to-purple-500/5 text-purple-400",
    amber: "from-amber-500/20 to-amber-500/5 text-amber-400",
  };

  return (
    <div className="stat-card glow group">
      <div className="flex items-start justify-between">
        <div>
          <p className="stat-label">{label}</p>
          <p className="stat-value mt-2">{value}</p>
        </div>
        <div
          className={`w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center ${
            accentColors[accent] || accentColors.brand
          } transition-transform duration-300 group-hover:scale-110`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
