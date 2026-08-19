import type { PropsWithChildren,ReactNode } from "react";
interface Props{title?:string;eyebrow?:string;actions?:ReactNode;className?:string;}
export function Card({title,eyebrow,actions,className="",children}:PropsWithChildren<Props>){return <section className={`card ${className}`.trim()}>{(title||eyebrow||actions)&&<header className="card__header"><div>{eyebrow&&<p className="eyebrow">{eyebrow}</p>}{title&&<h2>{title}</h2>}</div>{actions&&<div className="card__actions">{actions}</div>}</header>}{children}</section>;}
