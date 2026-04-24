import type { Meta, StoryObj } from "@storybook/react";
import { DataTable } from "./DataTable";
import { Badge } from "../atoms/Badge";

interface Member {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  credits: number;
}

const rows: Member[] = [
  { id: 1, name: "이민서", email: "design@litmers.com", role: "admin", credits: 980 },
  { id: 2, name: "박지호", email: "jiho@litmers.com", role: "user", credits: 120 },
  { id: 3, name: "김유나", email: "yuna@litmers.com", role: "user", credits: 0 },
];

const meta: Meta<typeof DataTable<Member>> = {
  title: "Organisms/DataTable",
  component: DataTable<Member>,
};
export default meta;

type Story = StoryObj<typeof DataTable<Member>>;

export const Members: Story = {
  render: () => (
    <DataTable<Member>
      rows={rows}
      rowKey={(r) => String(r.id)}
      columns={[
        { key: "name", header: "이름", render: (r) => r.name },
        { key: "email", header: "이메일", render: (r) => r.email },
        {
          key: "role",
          header: "권한",
          render: (r) => <Badge tone={r.role === "admin" ? "brand" : "neutral"}>{r.role === "admin" ? "관리자" : "일반"}</Badge>,
        },
        { key: "credits", header: "크레딧", align: "right", render: (r) => r.credits.toLocaleString() },
      ]}
    />
  ),
};

export const Empty: Story = {
  render: () => (
    <DataTable<Member>
      rows={[]}
      rowKey={(r) => String(r.id)}
      columns={[
        { key: "name", header: "이름", render: (r) => r.name },
        { key: "email", header: "이메일", render: (r) => r.email },
      ]}
      emptyMessage="회원이 없습니다."
    />
  ),
};
