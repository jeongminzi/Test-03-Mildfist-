import type { Meta, StoryObj } from "@storybook/react";
import { InfoRow } from "./InfoRow";
import { Divider } from "../atoms/Divider";

const meta: Meta<typeof InfoRow> = {
  title: "Molecules/InfoRow",
  component: InfoRow,
  args: { label: "결제 금액", value: "₩9,900" },
};
export default meta;

type Story = StoryObj<typeof InfoRow>;

export const Default: Story = {};

export const List: Story = {
  render: () => (
    <div className="w-80 px-4 bg-bg-floating rounded-card border border-border-muted">
      <InfoRow label="이름" value="이정민" />
      <Divider />
      <InfoRow label="이메일" value="design@litmers.com" />
      <Divider />
      <InfoRow label="크레딧" value="120" />
    </div>
  ),
};
