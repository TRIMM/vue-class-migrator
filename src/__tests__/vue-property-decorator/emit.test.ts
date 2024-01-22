import { project, expectMigration } from '../utils';

describe('@Emit decorator', () => {
  afterAll(() => {
    project.getSourceFiles().forEach((file) => file.deleteImmediatelySync());
  });

  test('@Emit simple', async () => {
    await expectMigration(
      `@Component
                export default class Test extends Vue {
                    @Emit()
                    onChildChanged(e: Event) { return val; }
                }`,
      // Result
      `import { defineComponent } from "vue";

                export default defineComponent({
                    methods: {
                        onChildChanged(e: Event) {
                            this.$emit('on-child-changed', val, e);
                        }
                    }
                })`,
    );
  });

  test('@Emit no return', async () => {
    await expectMigration(
      `@Component
                export default class Test extends Vue {
                  @Emit()
                  addToCount(n: number) {
                    this.count += n;
                  }
                }`,
      // Result
      `import { defineComponent } from "vue";

                export default defineComponent({
                  methods: {
                    addToCount(n: number) {
                      this.count += n;
                      this.$emit('add-to-count', n);
                    }
                  }
                })`,
    );
  });

  test('@Emit(\'withName\')', async () => {
    await expectMigration(
      `@Component
                export default class Test extends Vue {
                  @Emit('reset')
                  resetCount() {
                    this.count = 0;
                  }
                }`,
      // Result
      `import { defineComponent } from "vue";

                export default defineComponent({
                  methods: {
                    resetCount() {
                      this.count = 0;
                      this.$emit('reset');
                    }
                  }
                })`,
    );
  });

  test('@Emit with return no param', async () => {
    await expectMigration(
      `@Component
                export default class Test extends Vue {
                  @Emit()
                  returnValue() {
                    return 10;
                  }
                }`,
      // Result
      `import { defineComponent } from "vue";

                export default defineComponent({
                  methods: {
                    returnValue() {
                      this.$emit('return-value', 10);
                    }
                  }
                })`,
    );
  });

  test('@Emit with return and param', async () => {
    await expectMigration(
      `@Component
                export default class Test extends Vue {
                  @Emit()
                  onInputChange(e) {
                    return e.target.value;
                  }
                }`,
      // Result
      `import { defineComponent } from "vue";

                export default defineComponent({
                  methods: {
                    onInputChange(e) {
                      this.$emit('on-input-change', e.target.value, e);
                    }
                  }
                })`,
    );
  });
  //
  // test('@Emit with promise', async () => {
  //   await expectMigration(
  //     `@Component
  //               export default class Test extends Vue {
  //                 @Emit()
  //                 promise() {
  //                   return new Promise((resolve) => {
  //                     setTimeout(() => {
  //                       resolve(20)
  //                     }, 0)
  //                   })
  //                 }
  //               }`,
  //     // Result
  //     `import { defineComponent } from "vue";
  //
  //               export default defineComponent({
  //                 methods: {
  //                   promise() {
  //                     const promise = new Promise((resolve) => {
  //                       setTimeout(() => {
  //                         resolve(20)
  //                       }, 0)
  //                     })
  //
  //                     promise.then((value) => {
  //                       this.$emit('promise', value)
  //                     })
  //                   }
  //                 }
  //               })`,
  //   );
  // });
});
