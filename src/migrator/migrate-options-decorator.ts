import { ClassDeclaration, SyntaxKind } from 'ts-morph';

export default (clazz: ClassDeclaration): string => {
  const decorator = clazz.getDecorator('Options');
  if (!decorator) {
    throw new Error(`Class ${clazz.getName()} doesn't have a options decorator.`);
  }
  const componentProperties = decorator
    .getArguments()
    .pop()
    ?.asKindOrThrow(SyntaxKind.ObjectLiteralExpression, '@Options props argument should be and object {}');

  const dataProp = componentProperties?.getProperty('data');
  if (dataProp
    && ![
      SyntaxKind.MethodDeclaration,
      SyntaxKind.PropertyAssignment,
    ].some((kind) => dataProp.isKind(kind))) {
    throw new Error(`@Options Data prop should be an object or a method. Type: ${dataProp.getKindName()}`);
  }
  return componentProperties?.getText() ?? '{}';
};

const hasOptionsDecorator = (clazz: ClassDeclaration): boolean => {
  const decorator = clazz.getDecorator('Options');
  if (!decorator) {
    return false;
  }
  return true;
};

export { hasOptionsDecorator };
