import { ReactNode } from "react";

export default function Container({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full px-6 md:px-7">
      {children}
    </div>
  );
}