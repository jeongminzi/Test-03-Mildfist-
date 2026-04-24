import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "./Avatar";

const meta: Meta<typeof Avatar> = {
  title: "Atoms/Avatar",
  component: Avatar,
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
  },
  args: { name: "민서" },
};
export default meta;

type Story = StoryObj<typeof Avatar>;

export const Initials: Story = {};
export const WithImage: Story = {
  args: { src: "https://i.pravatar.cc/100?img=12" },
};
export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-3">
      <Avatar name="A" size="xs" />
      <Avatar name="B" size="sm" />
      <Avatar name="C" size="md" />
      <Avatar name="D" size="lg" />
      <Avatar name="E" size="xl" />
    </div>
  ),
};
