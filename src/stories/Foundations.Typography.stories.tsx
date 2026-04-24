import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Foundations/Typography",
};
export default meta;

type Story = StoryObj;

const Sample = ({ role, className, sample }: { role: string; className: string; sample: string }) => (
  <div className="flex items-baseline gap-6 py-3 border-b border-border-muted">
    <span className="w-32 text-xs font-mono text-text-neutral-muted shrink-0">{role}</span>
    <span className={className}>{sample}</span>
  </div>
);

export const Roles: Story = {
  render: () => (
    <div>
      <p className="text-sm text-text-neutral-muted mb-4">
        Pretendard 기반의 타이포그래피 역할. 본문 코드에서는 Tailwind 유틸리티 (text-xl, font-semibold 등)를 직접 사용합니다.
      </p>
      <Sample role="heading.xl" className="text-3xl font-semibold text-text-neutral tracking-tight" sample="AI 패션 스타일 피드" />
      <Sample role="heading.lg" className="text-2xl font-semibold text-text-neutral tracking-tight" sample="가상 피팅을 시작해 보세요" />
      <Sample role="heading.md" className="text-lg font-semibold text-text-neutral" sample="회원 정보" />
      <Sample role="heading.sm" className="text-base font-semibold text-text-neutral" sample="결제 내역" />
      <Sample role="body.lg" className="text-base text-text-neutral" sample="다양한 스타일을 탐색하고, AI 가상 피팅을 체험하세요." />
      <Sample role="body.md" className="text-sm text-text-neutral" sample="이메일을 입력해 주세요." />
      <Sample role="body.sm" className="text-xs text-text-neutral" sample="로그인 후 이용할 수 있습니다." />
      <Sample role="label.md" className="text-sm font-medium text-text-neutral" sample="이메일" />
      <Sample role="label.sm" className="text-xs font-medium text-text-neutral-muted uppercase tracking-wide" sample="TODAY" />
    </div>
  ),
};
