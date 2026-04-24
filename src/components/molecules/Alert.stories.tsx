import type { Meta, StoryObj } from "@storybook/react";
import { Alert } from "./Alert";
import { Button } from "../atoms/Button";

const meta: Meta<typeof Alert> = {
  title: "Molecules/Alert",
  component: Alert,
  argTypes: {
    tone: { control: "select", options: ["neutral", "informative", "positive", "critical", "warning"] },
  },
  args: { children: "이민서님에게 +50 크레딧이 처리되었습니다 (잔액: 230)" },
};
export default meta;

type Story = StoryObj<typeof Alert>;

const Info = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

export const Positive: Story = { args: { tone: "positive", title: "처리 완료" } };
export const Critical: Story = {
  args: { tone: "critical", title: "처리 실패", children: "네트워크 연결이 끊어졌습니다." },
};
export const Informative: Story = {
  args: { tone: "informative", title: "안내", icon: <Info /> },
};
export const WithAction: Story = {
  args: {
    tone: "neutral",
    title: "데모 모드",
    children: "실제 결제는 이루어지지 않습니다.",
    action: <Button size="sm" variant="ghost">자세히</Button>,
  },
};

export const AdminCreditsSuccess: Story = {
  render: () => (
    <div className="w-[480px] flex flex-col gap-2">
      <Alert tone="positive" title="처리 완료">
        이민서님에게 +50 크레딧이 처리되었습니다 (잔액: 230)
      </Alert>
      <Alert tone="critical" title="크레딧 부족">
        보유 잔액이 부족합니다. 충전 후 다시 시도해 주세요.
      </Alert>
    </div>
  ),
};
