/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

export const useAngularElementScope = (elementKey: string) => {
  const [scope, setScope] = useState<any>(null);

  const getScope = () => {
    const intervalId = setInterval(() => {
      const $scope = window.angular.element(document.querySelector(elementKey)).scope();

      if ($scope) {
        setScope($scope);
        clearInterval(intervalId);
      }
    }, 100);

    return () => {
      clearInterval(intervalId);
    }
  }

  useEffect(() => {
    if (scope) return;

    const deregister = getScope();

    return () => deregister();
  }, [scope]);

  const refreshScope = () => {
    setScope(null);
  }

  return {
    scope,
    refreshScope
  };
}
