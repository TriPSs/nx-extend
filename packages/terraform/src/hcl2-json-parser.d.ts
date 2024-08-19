declare module 'hcl2-json-parser' {
  export type HclDef = {
    data?: {
      [data: string]: {
        [dataName: string]: [{ [propertyName: string]: any }]
      }
    }

    resource?: {
      [resource: string]: {
        [resourceName: string]: [{ [propertyName: string]: any }]
      }
    }

    terraform?: [
      {
        backend?: [{ [propertyName: string]: any }]
      }
    ]

    module?: {
      [moduleName: string]: [{ source: string }]
    }
  }

  export function parseToObject(data: string): Promise<HclDef>
}
