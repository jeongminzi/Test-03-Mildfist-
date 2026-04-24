import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Atoms/Checkbox",
  component: Checkbox,
  args: { label: "이용약관에 동의합니다", id: "agree" },
};
export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };
export const Disabled: Story = { args: { disabled: true } };
export const WithDescription: Story = {
  args: {
    label: "마케팅 정보 수신 동의",
    description: "신상품과 이벤트 알림을 이메일로 받아봅니다.",
  },
};
