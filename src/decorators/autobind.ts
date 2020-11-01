export function Autobind(
  _target: any,
  _methodName: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const original = descriptor.value;
  const modified: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = original.bind(this);
      return boundFn;
    },
  };
  return modified;
}
