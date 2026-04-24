import type { Meta, StoryObj } from "@storybook/react";
import { Spinner } from "./Spinner";

const meta: Meta<typeof Spinner> = {
  title: "Atoms/Spinner",
  component: Spinner,
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    tone: { control: "select", options: ["brand", "neutral", "inverted"] },
  },
};
export default meta;

type Story = StoryObj<typeof Spinner>;

export const Brand: Story = { args: { tone: "brand", size: "md" } };
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  ),
};
