declare module '@evops/hcl-terraform-parser' {
  export type HclDef = {
    module_calls: {
      [key: string]: {
        source: string
      }
    }
  }

  export function parse(data: Buffer): HclDef
}
