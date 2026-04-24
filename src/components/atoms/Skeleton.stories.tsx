import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "./Skeleton";

const meta: Meta<typeof Skeleton> = {
  title: "Atoms/Skeleton",
  component: Skeleton,
};
export default meta;

type Story = StoryObj<typeof Skeleton>;

export const Rect: Story = {
  render: () => <Skeleton width={240} height={140} />,
};

export const Circle: Story = {
  render: () => <Skeleton shape="circle" width={48} height={48} />,
};

export const ListRow: Story = {
  render: () => (
    <div className="flex items-center gap-3 w-80">
      <Skeleton shape="circle" width={40} height={40} />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton shape="text" width="60%" />
        <Skeleton shape="text" width="40%" />
      </div>
    </div>
  ),
};

export const StyleCardPlaceholder: Story = {
  render: () => (
    <div className="w-64 flex flex-col gap-2">
      <Skeleton width="100%" height={320} />
      <div className="flex items-center gap-2 px-1">
        <Skeleton shape="circle" width={20} height={20} />
        <Skeleton shape="text" width="40%" />
      </div>
    </div>
  ),
};
