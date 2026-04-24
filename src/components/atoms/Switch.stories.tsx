import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Switch } from "./Switch";

const meta: Meta<typeof Switch> = {
  title: "Atoms/Switch",
  component: Switch,
};
export default meta;

type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  render: () => {
    const Demo = () => {
      const [on, setOn] = useState(false);
      return <Switch checked={on} onChange={setOn} />;
    };
    return <Demo />;
  },
};

export const WithLabel: Story = {
  render: () => {
    const Demo = () => {
      const [on, setOn] = useState(true);
      return (
        <div className="w-80">
          <Switch
            checked={on}
            onChange={setOn}
            label="마케팅 알림"
            description="이벤트와 신규 기능을 이메일로 받아봅니다"
          />
        </div>
      );
    };
    return <Demo />;
  },
};

export const Disabled: Story = {
  render: () => (
    <Switch checked={true} onChange={() => {}} label="플러스 멤버십" disabled />
  ),
};
