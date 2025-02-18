import { useEffect, useState } from "react";
import { ServiceTypings } from "../types/services.old";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    angular: any;
  }
}

export const useAngularInjector = <T extends keyof ServiceTypings>(serviceKey: T): ServiceTypings[T] | null => {
  const [service, setService] = useState<T | null>(null);

  useEffect(() => {
    const $injector = window.angular.element(document.body).injector();

    if (!$injector) return;

    setService($injector.get(serviceKey));

  }, [serviceKey]);

  return service as ServiceTypings[T] | null;
}

export const useAngularRootScope = () => useAngularInjector('$rootScope');
