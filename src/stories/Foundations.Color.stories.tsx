import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Foundations/Color",
};
export default meta;

type Story = StoryObj;

const Swatch = ({ name, varName }: { name: string; varName: string }) => (
  <div className="flex items-center gap-3">
    <div
      className="w-12 h-12 rounded-lg border border-border-muted shrink-0"
      style={{ background: `var(${varName})` }}
    />
    <div className="text-xs">
      <p className="font-medium text-text-neutral">{name}</p>
      <p className="text-text-neutral-muted font-mono">{varName}</p>
    </div>
  </div>
);

const Group = ({ title, swatches }: { title: string; swatches: Array<[string, string]> }) => (
  <section className="mb-8">
    <h3 className="text-sm font-semibold text-text-neutral-muted uppercase tracking-wide mb-3">{title}</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {swatches.map(([name, v]) => (
        <Swatch key={v} name={name} varName={v} />
      ))}
    </div>
  </section>
);

export const Foreground: Story = {
  render: () => (
    <Group
      title="Foreground (text · icon)"
      swatches={[
        ["fg.neutral-solid", "--fg-neutral-solid"],
        ["fg.neutral-muted", "--fg-neutral-muted"],
        ["fg.neutral-subtle", "--fg-neutral-subtle"],
        ["fg.neutral-inverted", "--fg-neutral-inverted"],
        ["fg.brand-solid", "--fg-brand-solid"],
        ["fg.positive-solid", "--fg-positive-solid"],
        ["fg.critical-solid", "--fg-critical-solid"],
        ["fg.informative-solid", "--fg-informative-solid"],
        ["fg.magic-solid", "--fg-magic-solid"],
      ]}
    />
  ),
};

export const Background: Story = {
  render: () => (
    <Group
      title="Background (surfaces · fills)"
      swatches={[
        ["bg.layer-default", "--bg-layer-default"],
        ["bg.layer-floating", "--bg-layer-floating"],
        ["bg.neutral-weak", "--bg-neutral-weak"],
        ["bg.neutral-muted", "--bg-neutral-muted"],
        ["bg.neutral-solid", "--bg-neutral-solid"],
        ["bg.brand-solid", "--bg-brand-solid"],
        ["bg.brand-solid-pressed", "--bg-brand-solid-pressed"],
        ["bg.brand-weak", "--bg-brand-weak"],
        ["bg.positive-weak", "--bg-positive-weak"],
        ["bg.critical-weak", "--bg-critical-weak"],
        ["bg.overlay", "--bg-overlay"],
      ]}
    />
  ),
};

export const Stroke: Story = {
  render: () => (
    <Group
      title="Stroke (borders · dividers)"
      swatches={[
        ["stroke.neutral-muted", "--stroke-neutral-muted"],
        ["stroke.neutral-subtle", "--stroke-neutral-subtle"],
        ["stroke.neutral-solid", "--stroke-neutral-solid"],
        ["stroke.brand-solid", "--stroke-brand-solid"],
      ]}
    />
  ),
};

const PrimitiveRamp = ({ family, prefix, steps }: { family: string; prefix: string; steps: number[] }) => (
  <section className="mb-6">
    <h3 className="text-sm font-semibold text-text-neutral mb-2">{family}</h3>
    <div className="grid grid-cols-11 gap-1">
      {steps.map((s) => (
        <div key={s} className="flex flex-col items-center text-[10px]">
          <div
            className="w-full h-12 rounded border border-border-muted"
            style={{ background: `var(--${prefix}-${s})` }}
          />
          <span className="mt-1 text-text-neutral-muted">{s}</span>
        </div>
      ))}
    </div>
  </section>
);

export const Primitives: Story = {
  render: () => {
    const fullSteps = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
    const chromaticSteps = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
    return (
      <div>
        <p className="text-sm text-text-neutral-muted mb-4">
          Primitive 팔레트는 raw 스케일입니다. UI 코드는 semantic 토큰만 참조해야 합니다.
        </p>
        <PrimitiveRamp family="Gray" prefix="gray" steps={fullSteps} />
        <PrimitiveRamp family="Carrot (brand)" prefix="carrot" steps={chromaticSteps} />
        <PrimitiveRamp family="Green (positive)" prefix="green" steps={chromaticSteps} />
        <PrimitiveRamp family="Blue (informative)" prefix="blue" steps={chromaticSteps} />
        <PrimitiveRamp family="Purple (magic)" prefix="purple" steps={chromaticSteps} />
      </div>
    );
  },
};
