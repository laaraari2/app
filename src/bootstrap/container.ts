type Factory<T> = (container: Container) => T;

export class Container {
  private readonly factories = new Map<string, Factory<any>>();
  private readonly instances = new Map<string, any>();

  registerSingleton<T>(key: string, factory: Factory<T>): void {
    this.factories.set(key, factory);
  }

  registerTransient<T>(key: string, factory: Factory<T>): void {
    this.factories.set(`${key}:transient`, factory);
  }

  resolve<T>(key: string): T {
    if (this.instances.has(key)) {
      return this.instances.get(key);
    }

    const factory = this.factories.get(key);

    if (!factory) {
      throw new Error(`Dependency "${key}" is not registered.`);
    }

    const instance = factory(this);

    this.instances.set(key, instance);

    return instance;
  }

  create<T>(key: string): T {
    const factory =
      this.factories.get(`${key}:transient`) ??
      this.factories.get(key);

    if (!factory) {
      throw new Error(`Dependency "${key}" is not registered.`);
    }

    return factory(this);
  }

  has(key: string): boolean {
    return (
      this.factories.has(key) ||
      this.factories.has(`${key}:transient`)
    );
  }

  clear(): void {
    this.instances.clear();
  }
}

export const container = new Container();
