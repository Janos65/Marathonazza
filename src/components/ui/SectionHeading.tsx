import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  hint?: string
}

export default function SectionHeading({ children, hint }: Props) {
  return (
    <div className="mb-4">
      <h2 className="text-2xl font-serif font-semibold text-green-800">{children}</h2>
      {hint && <p className="mt-0.5 text-sm text-gray-500">{hint}</p>}
    </div>
  )
}

export function GoldDivider() {
  return <hr className="my-10 border-0 border-t-2 border-gold/30" />
}
