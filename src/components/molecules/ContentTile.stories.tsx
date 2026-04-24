import type { Meta, StoryObj } from "@storybook/react";
import { ContentTile } from "./ContentTile";
import { Button } from "../atoms/Button";

const meta: Meta<typeof ContentTile> = {
  title: "Molecules/ContentTile",
  component: ContentTile,
  args: {
    imageUrl: "https://picsum.photos/seed/content-tile/400/280",
    imageAlt: "민서님의 스타일",
    authorName: "민서",
    timestamp: "2026-04-10",
    likesCount: 12,
  },
};
export default meta;

type Story = StoryObj<typeof ContentTile>;

export const Default: Story = {
  render: (args) => (
    <div className="w-64">
      <ContentTile
        {...args}
        actions={
          <>
            <Button size="sm" variant="danger" className="flex-1">숨김</Button>
            <Button size="sm" variant="danger">삭제</Button>
          </>
        }
      />
    </div>
  ),
};

export const Hidden: Story = {
  render: (args) => (
    <div className="w-64">
      <ContentTile
        {...args}
        hidden
        actions={
          <>
            <Button size="sm" variant="ghost" className="flex-1">숨김 해제</Button>
            <Button size="sm" variant="danger">삭제</Button>
          </>
        }
      />
    </div>
  ),
};

export const Grid: Story = {
  render: (args) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-[800px]">
      {Array.from({ length: 4 }).map((_, i) => (
        <ContentTile
          key={i}
          {...args}
          imageUrl={`https://picsum.photos/seed/content-tile-${i}/400/${280 + (i % 2) * 60}`}
          authorName={["민서", "지호", "유나", "도윤"][i]}
          likesCount={(i + 1) * 7}
          hidden={i === 2}
          actions={
            <>
              <Button size="sm" variant="danger" className="flex-1">{i === 2 ? "숨김 해제" : "숨김"}</Button>
              <Button size="sm" variant="danger">삭제</Button>
            </>
          }
        />
      ))}
    </div>
  ),
};
