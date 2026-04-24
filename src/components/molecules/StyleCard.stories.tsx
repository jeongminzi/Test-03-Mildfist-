import type { Meta, StoryObj } from "@storybook/react";
import { StyleCard, StyleCardItem } from "./StyleCard";

const sampleItem: StyleCardItem = {
  id: 1,
  href: "#",
  imageUrl: "https://picsum.photos/seed/style-1/600/800",
  userName: "민서",
  userProfile: null,
  likesCount: 12,
  itemNames: ["블랙 가죽 자켓", "화이트 티셔츠", "데님 팬츠"],
};

const meta: Meta<typeof StyleCard> = {
  title: "Molecules/StyleCard",
  component: StyleCard,
  argTypes: {
    variant: { control: "select", options: ["regular", "wide", "tall", "feature"] },
  },
  args: { item: sampleItem, variant: "regular" },
};
export default meta;

type Story = StoryObj<typeof StyleCard>;

export const Regular: Story = {
  render: (args) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 [grid-auto-rows:220px] gap-4 w-[720px]">
      <StyleCard {...args} />
    </div>
  ),
};

export const Wide: Story = {
  args: { variant: "wide" },
  render: (args) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 [grid-auto-rows:220px] gap-4 w-[720px]">
      <StyleCard {...args} />
    </div>
  ),
};

export const Tall: Story = {
  args: { variant: "tall" },
  render: (args) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 [grid-auto-rows:220px] gap-4 w-[720px]">
      <StyleCard {...args} />
    </div>
  ),
};

export const Feature: Story = {
  args: { variant: "feature" },
  render: (args) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 [grid-auto-rows:220px] gap-4 w-[720px]">
      <StyleCard {...args} />
    </div>
  ),
};
