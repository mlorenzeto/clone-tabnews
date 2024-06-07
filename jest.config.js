/** @returns {Promise<import('jest').Config>} */
module.exports = async () => {
  return {
    modulePathIgnorePatterns: [".next", "node_modules"],
  };
};
