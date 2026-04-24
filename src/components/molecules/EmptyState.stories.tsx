import type { Meta, StoryObj } from "@storybook/react";
import { EmptyState } from "./EmptyState";
import { Button } from "../atoms/Button";

const meta: Meta<typeof EmptyState> = {
  title: "Molecules/EmptyState",
  component: EmptyState,
  args: {
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </svg>
    ),
    title: "아직 업로드된 스타일이 없습니다",
    description: "첫 스타일을 올려 다른 사용자들과 공유해보세요.",
  },
};
export default meta;

type Story = StoryObj<typeof EmptyState>;

export const Basic: Story = {};
export const WithAction: Story = {
  args: { action: <Button>스타일 올리기</Button> },
};
