import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ModalShell } from "./ModalShell";
import { Button } from "../atoms/Button";

const meta: Meta<typeof ModalShell> = {
  title: "Organisms/ModalShell",
  component: ModalShell,
};
export default meta;

type Story = StoryObj<typeof ModalShell>;

export const Confirm: Story = {
  render: () => {
    const Demo = () => {
      const [open, setOpen] = useState(true);
      return (
        <>
          <Button onClick={() => setOpen(true)}>모달 열기</Button>
          <ModalShell
            open={open}
            onClose={() => setOpen(false)}
            title="신고하시겠어요?"
            footer={
              <>
                <Button variant="secondary" onClick={() => setOpen(false)}>취소</Button>
                <Button variant="primary" onClick={() => setOpen(false)}>신고하기</Button>
              </>
            }
          >
            <p className="text-sm text-text-neutral-muted">
              부적절한 콘텐츠를 발견하셨다면 알려주세요. 검토 후 적절한 조치를 취하겠습니다.
            </p>
          </ModalShell>
        </>
      );
    };
    return <Demo />;
  },
};
