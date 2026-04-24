import type { Meta, StoryObj } from "@storybook/react";
import { DropdownMenu } from "./DropdownMenu";
import { Avatar } from "../atoms/Avatar";

const meta: Meta<typeof DropdownMenu> = {
  title: "Molecules/DropdownMenu",
  component: DropdownMenu,
};
export default meta;

type Story = StoryObj<typeof DropdownMenu>;

export const UserMenu: Story = {
  render: () => (
    <div className="flex justify-end p-8">
      <DropdownMenu
        trigger={<Avatar name="민서" size="sm" />}
        items={[
          { key: "mypage", label: "마이페이지", href: "#" },
          { key: "fitting", label: "가상 피팅", href: "#" },
          { key: "logout", label: "로그아웃", destructive: true, onSelect: () => alert("로그아웃") },
        ]}
      />
    </div>
  ),
};
