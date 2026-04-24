import type { Meta, StoryObj } from "@storybook/react";
import { KeyValueTable, KeyValueColumn } from "./KeyValueTable";

interface Pkg { name: string; credits: number; price: string }
interface DailyStat { day: string; count: number; total: number }

const meta: Meta = {
  title: "Molecules/KeyValueTable",
};
export default meta;

type Story = StoryObj;

const packages: Pkg[] = [
  { name: "10크레딧 패키지", credits: 10, price: "1,000" },
  { name: "30크레딧 패키지", credits: 30, price: "3,000" },
  { name: "50크레딧 패키지", credits: 50, price: "5,000" },
];

const pkgCols: KeyValueColumn<Pkg>[] = [
  { key: "name", header: "패키지", render: (r) => r.name },
  { key: "credits", header: "크레딧", align: "right", render: (r) => r.credits },
  { key: "price", header: "가격", align: "right", render: (r) => <span className="text-text-brand">{r.price}원</span> },
];

export const CreditPackages: Story = {
  render: () => (
    <div className="w-[600px]">
      <KeyValueTable
        rows={packages}
        rowKey={(r) => r.name}
        columns={pkgCols}
        footer={
          <p className="text-xs text-text-neutral-subtle">
            프로토타입 — 패키지 수정 기능은 추후 추가됩니다.
          </p>
        }
      />
    </div>
  ),
};

const daily: DailyStat[] = [
  { day: "11/01", count: 12, total: 380 },
  { day: "11/02", count: 8, total: 240 },
  { day: "11/03", count: 15, total: 470 },
  { day: "11/04", count: 21, total: 690 },
];

export const DailySales: Story = {
  render: () => (
    <div className="w-[600px]">
      <KeyValueTable<DailyStat>
        rows={daily}
        rowKey={(r) => r.day}
        columns={[
          { key: "day", header: "날짜", render: (r) => r.day },
          { key: "count", header: "건수", align: "right", render: (r) => `${r.count}건` },
          {
            key: "total",
            header: "크레딧 합계",
            align: "right",
            render: (r) => <span className="text-text-positive font-medium">{r.total.toLocaleString()}C</span>,
          },
        ]}
      />
    </div>
  ),
};

export const Empty: Story = {
  render: () => (
    <div className="w-[600px]">
      <KeyValueTable<DailyStat>
        rows={[]}
        rowKey={(r) => r.day}
        columns={[
          { key: "day", header: "날짜", render: (r) => r.day },
          { key: "count", header: "건수", align: "right", render: (r) => r.count },
        ]}
        emptyMessage="최근 7일간 매출이 없습니다."
      />
    </div>
  ),
};
