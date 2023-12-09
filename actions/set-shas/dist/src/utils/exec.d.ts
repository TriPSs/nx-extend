/// <reference types="node" />
import { ShellString, ExecOptions } from 'shelljs';
import { ChildProcess } from 'child_process';
export interface Options extends ExecOptions {
    asString?: boolean;
    asJSON?: boolean;
}
export { ShellString, ChildProcess };
export type Result<Output> = Output extends string ? string : Output;
export declare const execCommand: <Output = {
    success: boolean;
    output: string;
}>(command: any, options?: Options) => Output;
