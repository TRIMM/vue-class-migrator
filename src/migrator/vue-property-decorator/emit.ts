import { CodeBlockWriter, Decorator, SyntaxKind } from 'ts-morph';
import type MigrationManager from '../migratorManager';
import { hyphenate } from '../utils';

// @Emit
export default (migrationManager: MigrationManager) => {
  const { clazz } = migrationManager;
  const emitters = clazz.getMethods().filter((m) => m.getDecorator('Emit'));

  emitters.forEach((emit) => {
    const emitName = emit.getName();
    const emitDecorators: Decorator[] = emit
      .getDecorators()
      .filter((decorator) => decorator.getName() === 'Emit');

    const events = emitDecorators.flatMap((d) =>
      d.getArguments().map((a) => a.getText()),
    );
    const eventName = hyphenate(emit.getName());
    const eventParameters = emit
      .getParameters()
      .map((p) => hyphenate(p.getName()))
      .join(', ');

    const returnStatement = emit
      .getBody()
      ?.forEachChildAsArray()
      .filter((c1) => c1.isKind(SyntaxKind.ReturnStatement));

    const bodyWithoutReturnStatement = emit
      .getBody()
      ?.forEachChildAsArray()
      .filter((c) => !c.isKind(SyntaxKind.ReturnStatement));
    const statementBody = bodyWithoutReturnStatement
      ?.map((c2) => c2.getText())
      .join('\n');

    const writer = new CodeBlockWriter();
    if (statementBody) {
      writer.writeLine(statementBody);
    }
    if (events.length > 0) {
      events.forEach((name) => {
        if (eventParameters) {
          writer.writeLine(`this.$emit(${name}, ${eventParameters});`);
        } else {
          writer.writeLine(`this.$emit(${name});`);
        }
      });
    } else {
      if (eventParameters && returnStatement?.length) {
        const returnValue = returnStatement[0]
          .getChildren()
          .filter(
            (child) =>
              !child.isKind(SyntaxKind.SemicolonToken) &&
              !child.isKind(SyntaxKind.ReturnKeyword),
          )
          .map((c) => c.getText())
          .join('');
        writer.writeLine(
          `this.$emit('${eventName}', ${returnValue}, ${eventParameters});`,
        );
      } else if (eventParameters) {
        writer.writeLine(`this.$emit('${eventName}', ${eventParameters});`);
      } else if (returnStatement?.length) {
        const returnValue = returnStatement[0]
          .getChildren()
          .filter(
            (child) =>
              !child.isKind(SyntaxKind.SemicolonToken) &&
              !child.isKind(SyntaxKind.ReturnKeyword),
          )
          .map((c) => c.getText())
          .join('');
        writer.writeLine(`this.$emit('${eventName}', ${returnValue});`);
      }
    }

    migrationManager.addMethod({
      methodName: emitName,
      parameters: emit.getParameters().map((p) => p.getStructure()),
      isAsync: emit.isAsync(),
      returnType: emit.getReturnTypeNode()?.getText(),
      statements: writer.toString(),
    });
  });
};
