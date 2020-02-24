interface EnvironmentVariables {[key: string]: string};

/**
 * Get all selected env variables.
 * @param {Array<String>} allVars List of vars to be retreived.
 * @return {EnvironmentVariables} Retreived vars
 */
export function getEnvironmentVariables(allVars: Array<String>): EnvironmentVariables {
  // Get all environment variables
  const CONFIG: {[key: string]: string} = process.env.CONFIG ? JSON.parse(process.env.CONFIG) : {};
  const vars: EnvironmentVariables = {};

  if (CONFIG && Object.keys(CONFIG).length > 0) {
    allVars.forEach((varName) => {
      const currentVar = CONFIG[`${varName}`];
      if (currentVar) {
        vars[`${varName}`] = currentVar;
      }
    });
  }
  return vars;
};
