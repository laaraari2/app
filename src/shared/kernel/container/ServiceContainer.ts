export class ServiceContainer {
  private readonly services = new Map<string, unknown>();

  register<T>(key: string, instance: T): void {
    this.services.set(key, instance);
  }

  resolve<T>(key: string): T {
    const service = this.services.get(key);

    if (!service) {
      throw new Error(`Service "${key}" is not registered.`);
    }

    return service as T;
  }
}

export const container = new ServiceContainer();
