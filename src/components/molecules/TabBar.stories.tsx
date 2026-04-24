import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { TabBar } from "./TabBar";

const meta: Meta<typeof TabBar> = {
  title: "Molecules/TabBar",
  component: TabBar,
};
export default meta;

type Story = StoryObj<typeof TabBar>;

export const Sort: Story = {
  render: () => {
    const Demo = () => {
      const [v, setV] = useState<"latest" | "popular">("latest");
      return (
        <TabBar
          items={[
            { key: "latest", label: "최신순" },
            { key: "popular", label: "인기순" },
          ]}
          value={v}
          onChange={setV}
        />
      );
    };
    return <Demo />;
  },
};

export const PaymentStatus: Story = {
  render: () => {
    const Demo = () => {
      const [v, setV] = useState<"all" | "completed" | "refunded">("all");
      return (
        <TabBar
          items={[
            { key: "all", label: "전체" },
            { key: "completed", label: "완료" },
            { key: "refunded", label: "환불됨" },
          ]}
          value={v}
          onChange={setV}
        />
      );
    };
    return <Demo />;
  },
};
