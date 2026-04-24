import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";

const meta: Meta<typeof Card> = {
  title: "Molecules/Card",
  component: Card,
  argTypes: {
    padding: { control: "select", options: ["none", "sm", "md", "lg"] },
    surface: { control: "select", options: ["default", "weak"] },
    bordered: { control: "boolean" },
    shadow: { control: "boolean" },
  },
  args: { children: "카드 내용입니다." },
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = { args: { shadow: true } };
export const Weak: Story = { args: { surface: "weak" } };
export const Bordered: Story = { args: { bordered: true } };
export const NoPadding: Story = {
  args: {
    padding: "none",
    children: (
      // eslint-disable-next-line @next/next/no-img-element
      <img src="https://picsum.photos/300/200" alt="" className="w-full rounded-card" />
    ),
  },
};
