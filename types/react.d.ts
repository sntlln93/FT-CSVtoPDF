import { HTMLAttributes } from "react";
declare module "react" {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    webkitdirectory?: string;
    mozdirectory?: string;
    directory?: string;
  }
}
