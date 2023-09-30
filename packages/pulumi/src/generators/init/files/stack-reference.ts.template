import * as pulumi from '@pulumi/pulumi';

type ExportTypes = typeof import('./pulumi');
type ExportTypesKey = keyof ExportTypes;
type ExportTypesValue<TKey extends ExportTypesKey> = ExportTypes[TKey];

type StrongTypedStackReference = Omit<pulumi.StackReference, 'getOutput' | 'requireOutput'> & {
  getOutput<T extends ExportTypesKey>(name: pulumi.Input<T>): ExportTypesValue<T>;
  requireOutput<T extends ExportTypesKey>(name: pulumi.Input<T>): ExportTypesValue<T>;
};

export function getStackReference() {
  const stack = pulumi.getStack();
  return new pulumi.StackReference(`organization/<%= name %>/${stack}`) as StrongTypedStackReference;
}
