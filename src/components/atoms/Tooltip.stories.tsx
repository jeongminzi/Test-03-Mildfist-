import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "./Tooltip";
import { IconButton } from "./IconButton";

const meta: Meta<typeof Tooltip> = {
  title: "Atoms/Tooltip",
  component: Tooltip,
  argTypes: {
    placement: { control: "select", options: ["top", "bottom", "left", "right"] },
  },
};
export default meta;

type Story = StoryObj<typeof Tooltip>;

const HeartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export const Default: Story = {
  args: { content: "좋아요", placement: "top" },
  render: (args) => (
    <div className="p-12 inline-flex">
      <Tooltip {...args}>
        <IconButton aria-label="좋아요"><HeartIcon /></IconButton>
      </Tooltip>
    </div>
  ),
};

export const AllPlacements: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-12 p-12">
      <Tooltip content="위에 표시" placement="top"><IconButton aria-label="t"><HeartIcon /></IconButton></Tooltip>
      <Tooltip content="아래에 표시" placement="bottom"><IconButton aria-label="b"><HeartIcon /></IconButton></Tooltip>
      <Tooltip content="왼쪽에 표시" placement="left"><IconButton aria-label="l"><HeartIcon /></IconButton></Tooltip>
      <Tooltip content="오른쪽에 표시" placement="right"><IconButton aria-label="r"><HeartIcon /></IconButton></Tooltip>
    </div>
  ),
};
