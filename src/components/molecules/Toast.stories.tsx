import type { Meta, StoryObj } from "@storybook/react";
import { ToastProvider, useToast } from "./Toast";
import { Button } from "../atoms/Button";

const meta: Meta = {
  title: "Molecules/Toast",
};
export default meta;

type Story = StoryObj;

const Demo = () => {
  const toast = useToast();
  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => toast.show("저장되었습니다", { tone: "positive" })}>positive</Button>
      <Button variant="secondary" onClick={() => toast.show("처리 중 오류가 발생했습니다", { tone: "critical" })}>
        critical
      </Button>
      <Button variant="ghost" onClick={() => toast.show("새 알림이 도착했어요", { tone: "informative" })}>
        informative
      </Button>
      <Button variant="secondary" onClick={() => toast.show("환영합니다")}>neutral</Button>
    </div>
  );
};

export const Default: Story = {
  render: () => (
    <ToastProvider>
      <Demo />
    </ToastProvider>
  ),
};
