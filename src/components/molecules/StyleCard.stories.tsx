import type { Meta, StoryObj } from "@storybook/react";
import { StyleCard, StyleCardItem } from "./StyleCard";

const sample = (overrides: Partial<StyleCardItem> = {}): StyleCardItem => ({
  id: 1,
  href: "#",
  imageUrl: "https://picsum.photos/seed/style-card/600/800",
  userName: "민서",
  userProfile: null,
  likesCount: 12,
  itemNames: ["블랙 가죽 자켓", "화이트 티셔츠", "데님 팬츠"],
  ...overrides,
});

const meta: Meta<typeof StyleCard> = {
  title: "Molecules/StyleCard",
  component: StyleCard,
};
export default meta;

type Story = StoryObj<typeof StyleCard>;

export const Default: Story = {
  render: () => (
    <div className="w-64">
      <StyleCard item={sample()} />
    </div>
  ),
};

export const Tall: Story = {
  render: () => (
    <div className="w-64">
      <StyleCard
        item={sample({
          imageUrl: "https://picsum.photos/seed/style-card-tall/600/1100",
          itemNames: ["트렌치 코트", "와이드 슬랙스"],
        })}
      />
    </div>
  ),
};

export const Wide: Story = {
  render: () => (
    <div className="w-64">
      <StyleCard
        item={sample({
          imageUrl: "https://picsum.photos/seed/style-card-wide/800/500",
          likesCount: 0,
        })}
      />
    </div>
  ),
};

export const NoItems: Story = {
  render: () => (
    <div className="w-64">
      <StyleCard item={sample({ itemNames: [], likesCount: 47 })} />
    </div>
  ),
};
