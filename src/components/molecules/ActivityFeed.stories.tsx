import type { Meta, StoryObj } from "@storybook/react";
import { ActivityFeed, ActivityItem } from "./ActivityFeed";

const meta: Meta<typeof ActivityFeed> = {
  title: "Molecules/ActivityFeed",
  component: ActivityFeed,
};
export default meta;

type Story = StoryObj<typeof ActivityFeed>;

const items: ActivityItem[] = [
  { key: "1", eventLabel: "가입", eventTone: "positive", actor: "이민서", detail: "신규 가입", timestamp: "11월 5일 14:32" },
  { key: "2", eventLabel: "스타일", eventTone: "magic", actor: "박지호", detail: "원피스 스타일 업로드", timestamp: "11월 5일 14:18" },
  { key: "3", eventLabel: "피팅", eventTone: "informative", actor: "김유나", detail: "1 크레딧 사용", timestamp: "11월 5일 14:02" },
  { key: "4", eventLabel: "충전", eventTone: "brand", actor: "정도윤", detail: "30 크레딧 충전", timestamp: "11월 5일 13:45" },
];

export const Default: Story = {
  render: () => (
    <div className="w-[640px]">
      <ActivityFeed items={items} />
    </div>
  ),
};

export const Empty: Story = {
  render: () => (
    <div className="w-[640px]">
      <ActivityFeed items={[]} />
    </div>
  ),
};
