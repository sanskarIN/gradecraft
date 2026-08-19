import type { ButtonHTMLAttributes,PropsWithChildren } from "react";
interface Props extends ButtonHTMLAttributes<HTMLButtonElement>{variant?:"primary"|"secondary"|"danger"|"ghost";}
export function Button({variant="primary",className="",children,...props}:PropsWithChildren<Props>){return <button className={`button button--${variant} ${className}`.trim()} {...props}>{children}</button>;}
