import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Foundations/Spacing",
};
export default meta;

type Story = StoryObj;

const steps = [
  { name: "space.0", v: "--space-0" },
  { name: "space.1", v: "--space-1" },
  { name: "space.2", v: "--space-2" },
  { name: "space.3", v: "--space-3" },
  { name: "space.4", v: "--space-4" },
  { name: "space.5", v: "--space-5" },
  { name: "space.6", v: "--space-6" },
  { name: "space.8", v: "--space-8" },
  { name: "space.10", v: "--space-10" },
  { name: "space.12", v: "--space-12" },
  { name: "space.16", v: "--space-16" },
];

export const Scale: Story = {
  render: () => (
    <div>
      <p className="text-sm text-text-neutral-muted mb-4">4-base scale. 컴포넌트 안 간격은 space.component.*, 페이지 레이아웃 간격은 space.layout.*을 사용합니다.</p>
      <div className="flex flex-col gap-2">
        {steps.map((s) => (
          <div key={s.v} className="flex items-center gap-4">
            <span className="w-24 text-xs font-mono text-text-neutral-muted">{s.name}</span>
            <div className="h-3 bg-bg-brand-solid rounded-sm" style={{ width: `var(${s.v})` }} />
          </div>
        ))}
      </div>
    </div>
  ),
};
