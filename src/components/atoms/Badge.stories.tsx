import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "Atoms/Badge",
  component: Badge,
  argTypes: {
    tone: { control: "select", options: ["neutral", "brand", "positive", "critical", "informative", "magic"] },
    size: { control: "select", options: ["sm", "md"] },
  },
  args: { children: "관리자" },
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const Neutral: Story = { args: { tone: "neutral", children: "일반" } };
export const Brand: Story = { args: { tone: "brand", children: "관리자" } };
export const Positive: Story = { args: { tone: "positive", children: "완료" } };
export const Critical: Story = { args: { tone: "critical", children: "환불됨" } };
export const Informative: Story = { args: { tone: "informative", children: "신규" } };
export const Magic: Story = { args: { tone: "magic", children: "프리미엄" } };

export const AllTones: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge tone="neutral">일반</Badge>
      <Badge tone="brand">관리자</Badge>
      <Badge tone="positive">완료</Badge>
      <Badge tone="critical">환불됨</Badge>
      <Badge tone="informative">신규</Badge>
      <Badge tone="magic">프리미엄</Badge>
    </div>
  ),
};
