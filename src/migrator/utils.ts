import type {
  ArrayLiteralExpression,
  ObjectLiteralExpression,
  ClassDeclaration,
  PropertyDeclaration,
  Node,
} from 'ts-morph';
import { SyntaxKind } from 'ts-morph';

export const addPropertyObject = (mainObject: ObjectLiteralExpression, propName: string, initializer = '{}'): ObjectLiteralExpression => mainObject
  .addPropertyAssignment({
    name: propName,
    initializer,
  })
  .getFirstDescendantByKindOrThrow(SyntaxKind.ObjectLiteralExpression);

export const addPropertyArray = (mainObject: ObjectLiteralExpression, propName: string, initializer = '[]'): ArrayLiteralExpression => mainObject
  .addPropertyAssignment({
    name: propName,
    initializer,
  })
  .getFirstDescendantByKindOrThrow(SyntaxKind.ArrayLiteralExpression);

export const getObjectProperty = (
  mainObject: ObjectLiteralExpression,
  property: string,
): ObjectLiteralExpression => {
  const computedObject = mainObject
    .getProperty(property)
    ?.getFirstDescendantByKind(SyntaxKind.ObjectLiteralExpression);
  if (computedObject) {
    return computedObject;
  }
  return addPropertyObject(mainObject, property);
};

export const getArrayProperty = (
  mainObject: ObjectLiteralExpression,
  property: string,
): ArrayLiteralExpression => {
  const computedObject = mainObject
    .getProperty(property)
    ?.getFirstDescendantByKind(SyntaxKind.ArrayLiteralExpression);
  if (computedObject) {
    return computedObject;
  }

  return addPropertyArray(mainObject, property);
};

export const extractPropertiesWithDecorator = (
  clazz: ClassDeclaration,
  decoratorName: string,
): PropertyDeclaration[] => clazz
  .getProperties()
  .filter((prop) => prop.getDecorator(decoratorName));

export const stringNodeToSTring = (node: Node): string => {
  if (
    node.isKind(SyntaxKind.StringLiteral)
    || node.isKind(SyntaxKind.NoSubstitutionTemplateLiteral)
  ) {
    return node.getLiteralText();
  }
  throw new Error(`Node is not a string: ${node.getKindName()}`);
};

// Code copied from Vue/src/shared/util.js
const hyphenateRE = /\B([A-Z])/g;
export const hyphenate = (str: string) => str.replace(hyphenateRE, '-$1').toLowerCase();
