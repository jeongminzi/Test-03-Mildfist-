import type { Meta, StoryObj } from "@storybook/react";
import { StatCard } from "./StatCard";

const meta: Meta<typeof StatCard> = {
  title: "Molecules/StatCard",
  component: StatCard,
  args: { label: "전체 회원", value: "1,284", delta: "지난 주 대비 +12" },
};
export default meta;

type Story = StoryObj<typeof StatCard>;

export const Default: Story = {};

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-[640px]">
      <StatCard label="전체 회원" value="1,284" />
      <StatCard label="결제 건수" value="328" delta="이번 달" />
      <StatCard label="피팅 횟수" value="9,402" />
      <StatCard label="총 매출" value="₩4.8M" />
    </div>
  ),
};
