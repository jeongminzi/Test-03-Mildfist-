import type { Meta, StoryObj } from "@storybook/react";
import { ProgressBar } from "./ProgressBar";

const meta: Meta<typeof ProgressBar> = {
  title: "Atoms/ProgressBar",
  component: ProgressBar,
  argTypes: {
    value: { control: { type: "number", min: 0, max: 100 } },
    tone: { control: "select", options: ["brand", "neutral"] },
  },
};
export default meta;

type Story = StoryObj<typeof ProgressBar>;

export const Determinate: Story = {
  args: { value: 60 },
  render: (args) => (
    <div className="w-80">
      <ProgressBar {...args} />
    </div>
  ),
};

export const Indeterminate: Story = {
  args: { value: undefined },
  render: (args) => (
    <div className="w-80">
      <ProgressBar {...args} />
    </div>
  ),
};

export const Neutral: Story = {
  args: { value: 35, tone: "neutral" },
  render: (args) => (
    <div className="w-80">
      <ProgressBar {...args} />
    </div>
  ),
};
