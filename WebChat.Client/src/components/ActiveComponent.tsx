import { ReactNode } from "react";

export default function ActiveComponent({ condition, children }: { condition: unknown; children: ReactNode }) {
  if (condition instanceof Function && condition()) return children;
  else if (condition) return children;
  else return <></>;
}
