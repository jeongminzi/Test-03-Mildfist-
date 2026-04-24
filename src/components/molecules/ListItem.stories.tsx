import type { Meta, StoryObj } from "@storybook/react";
import { ListItem } from "./ListItem";
import { Avatar } from "../atoms/Avatar";
import { Badge } from "../atoms/Badge";
import { Divider } from "../atoms/Divider";

const meta: Meta<typeof ListItem> = {
  title: "Molecules/ListItem",
  component: ListItem,
};
export default meta;

type Story = StoryObj<typeof ListItem>;

export const Default: Story = {
  render: () => (
    <div className="w-96 px-4 bg-bg-floating border border-border-muted rounded-card">
      <ListItem
        leading={<Avatar name="민서" size="md" />}
        primary="이민서"
        secondary="design@litmers.com"
        trailing={<Badge tone="brand">관리자</Badge>}
      />
      <Divider />
      <ListItem
        leading={<Avatar name="지호" size="md" />}
        primary="박지호"
        secondary="jiho@litmers.com"
        trailing={<Badge tone="neutral">일반</Badge>}
      />
    </div>
  ),
};
