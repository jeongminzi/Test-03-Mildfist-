import type { Meta, StoryObj } from "@storybook/react";
import { StyleGrid } from "./StyleGrid";
import type { StyleCardItem } from "./StyleCard";

const NAMES = ["민서", "지호", "유나", "도윤", "서아", "하준", "예린", "시우"];
const ITEM_POOL = [
  "블랙 가죽 자켓",
  "오버사이즈 후드",
  "화이트 티셔츠",
  "데님 팬츠",
  "스니커즈",
  "버킷햇",
  "크로스백",
  "체크 셔츠",
  "트렌치 코트",
];

function makeItems(count: number): StyleCardItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    href: "#",
    imageUrl: `https://picsum.photos/seed/style-${i + 1}/600/${600 + (i % 4) * 80}`,
    userName: NAMES[i % NAMES.length],
    userProfile: null,
    likesCount: (i * 13) % 47,
    itemNames: ITEM_POOL.slice(i % 3, (i % 3) + 3),
  }));
}

const meta: Meta<typeof StyleGrid> = {
  title: "Molecules/StyleGrid",
  component: StyleGrid,
};
export default meta;

type Story = StoryObj<typeof StyleGrid>;

export const Default20: Story = {
  render: () => <StyleGrid items={makeItems(20)} />,
};

export const Default8: Story = {
  render: () => <StyleGrid items={makeItems(8)} />,
};

export const AllRegular: Story = {
  render: () => <StyleGrid items={makeItems(12)} variantAt={() => "regular"} />,
};

export const FeatureFirst: Story = {
  render: () => (
    <StyleGrid
      items={makeItems(13)}
      variantAt={(i) => (i === 0 ? "feature" : i % 5 === 0 ? "wide" : "regular")}
    />
  ),
};
