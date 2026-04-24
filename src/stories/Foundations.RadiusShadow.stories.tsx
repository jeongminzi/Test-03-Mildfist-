import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Foundations/Radius & Shadow",
};
export default meta;

type Story = StoryObj;

const radii = [
  { name: "radius.none", v: "--radius-none" },
  { name: "radius.sm", v: "--radius-sm" },
  { name: "radius.md", v: "--radius-md" },
  { name: "radius.lg", v: "--radius-lg" },
  { name: "radius.xl", v: "--radius-xl" },
  { name: "radius.2xl", v: "--radius-2xl" },
  { name: "radius.full", v: "--radius-full" },
];

export const Radius: Story = {
  render: () => (
    <div>
      <h3 className="text-sm font-semibold text-text-neutral mb-3">Radius scale</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {radii.map((r) => (
          <div key={r.v} className="flex flex-col items-center gap-2">
            <div
              className="w-20 h-20 bg-bg-brand-solid"
              style={{ borderRadius: `var(${r.v})` }}
            />
            <span className="text-xs font-mono text-text-neutral-muted">{r.name}</span>
          </div>
        ))}
      </div>
    </div>
  ),
};

const shadows = [
  { name: "shadow.sm", v: "--shadow-sm" },
  { name: "shadow.md (card · popover)", v: "--shadow-md" },
  { name: "shadow.lg (modal)", v: "--shadow-lg" },
];

export const Shadow: Story = {
  render: () => (
    <div>
      <h3 className="text-sm font-semibold text-text-neutral mb-3">Shadow scale</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-4">
        {shadows.map((s) => (
          <div key={s.v} className="flex flex-col items-center gap-3">
            <div
              className="w-32 h-20 bg-bg-floating rounded-card"
              style={{ boxShadow: `var(${s.v})` }}
            />
            <span className="text-xs font-mono text-text-neutral-muted">{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  ),
};
