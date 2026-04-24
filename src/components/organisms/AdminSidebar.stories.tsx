import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";

const meta: Meta<typeof AdminSidebar> = {
  title: "Organisms/AdminSidebar",
  component: AdminSidebar,
};
export default meta;

type Story = StoryObj<typeof AdminSidebar>;

const items = [
  { key: "dashboard", label: "대시보드", href: "#" },
  { key: "members", label: "회원 관리", href: "#" },
  { key: "credits", label: "크레딧", href: "#" },
  { key: "payments", label: "결제 내역", href: "#" },
  { key: "contents", label: "콘텐츠 관리", href: "#" },
];

export const Default: Story = {
  render: () => {
    const Demo = () => {
      const [active, setActive] = useState("members");
      return (
        <div className="h-[400px] flex">
          <AdminSidebar items={items} activeKey={active} onNavigate={(it) => setActive(it.key)} />
        </div>
      );
    };
    return <Demo />;
  },
};
