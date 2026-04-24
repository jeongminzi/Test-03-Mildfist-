import type { Meta, StoryObj } from "@storybook/react";
import { ContentTile } from "./ContentTile";
import { Button } from "../atoms/Button";
import { IconButton } from "../atoms/IconButton";

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" /><path d="M14 11v6" />
    <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
  </svg>
);

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

/* Action hierarchy:
   - 숨김 / 숨김 해제: frequent reversible action → primary text button
     (secondary fill for "숨김", primary fill for "숨김 해제" since it
      brings the content back to live state).
   - 삭제: rare destructive action → small danger IconButton, isolated
     to the right so users don't reach for it by accident. */

export const Default: Story = {
  render: (args) => (
    <div className="w-64">
      <ContentTile
        {...args}
        actions={
          <>
            <Button size="sm" variant="secondary" className="flex-1">숨김</Button>
            <IconButton size="sm" variant="danger" aria-label="삭제"><TrashIcon /></IconButton>
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
            <Button size="sm" variant="primary" className="flex-1">숨김 해제</Button>
            <IconButton size="sm" variant="danger" aria-label="삭제"><TrashIcon /></IconButton>
          </>
        }
      />
    </div>
  ),
};

export const Grid: Story = {
  render: (args) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-[800px]">
      {Array.from({ length: 4 }).map((_, i) => {
        const isHidden = i === 2;
        return (
          <ContentTile
            key={i}
            {...args}
            imageUrl={`https://picsum.photos/seed/content-tile-${i}/400/${280 + (i % 2) * 60}`}
            authorName={["민서", "지호", "유나", "도윤"][i]}
            likesCount={(i + 1) * 7}
            hidden={isHidden}
            actions={
              <>
                <Button
                  size="sm"
                  variant={isHidden ? "primary" : "secondary"}
                  className="flex-1"
                >
                  {isHidden ? "숨김 해제" : "숨김"}
                </Button>
                <IconButton size="sm" variant="danger" aria-label="삭제"><TrashIcon /></IconButton>
              </>
            }
          />
        );
      })}
    </div>
  ),
};
