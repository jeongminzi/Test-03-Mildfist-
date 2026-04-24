import type { Meta, StoryObj } from "@storybook/react";
import { Divider } from "./Divider";

const meta: Meta<typeof Divider> = {
  title: "Atoms/Divider",
  component: Divider,
  argTypes: { orientation: { control: "radio", options: ["horizontal", "vertical"] } },
};
export default meta;

type Story = StoryObj<typeof Divider>;

export const Horizontal: Story = {
  render: () => (
    <div className="w-80">
      <p className="mb-2 text-text-neutral">위 텍스트</p>
      <Divider />
      <p className="mt-2 text-text-neutral">아래 텍스트</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="h-12 flex items-center gap-3">
      <span className="text-text-neutral">왼쪽</span>
      <Divider orientation="vertical" />
      <span className="text-text-neutral">오른쪽</span>
    </div>
  ),
};
