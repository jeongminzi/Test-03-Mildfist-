import type { Meta, StoryObj } from "@storybook/react";
import { IconButton } from "./IconButton";

const HeartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const meta: Meta<typeof IconButton> = {
  title: "Atoms/IconButton",
  component: IconButton,
  argTypes: {
    variant: { control: "select", options: ["primary", "ghost", "danger"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
  args: { "aria-label": "좋아요", children: <HeartIcon /> },
};
export default meta;

type Story = StoryObj<typeof IconButton>;

export const Primary: Story = { args: { variant: "primary" } };
export const Ghost: Story = { args: { variant: "ghost" } };
export const Danger: Story = { args: { variant: "danger" } };

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <IconButton aria-label="작게" size="sm"><HeartIcon /></IconButton>
      <IconButton aria-label="중간" size="md"><HeartIcon /></IconButton>
      <IconButton aria-label="크게" size="lg"><HeartIcon /></IconButton>
    </div>
  ),
};
