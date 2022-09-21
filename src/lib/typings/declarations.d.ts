// ====================================================== //
// ==================== Declarations ==================== //
// ====================================================== //

// Type decalrations for the entire library
// If you don't know what this is, you can ignore it.

/**
 * Define *.html files as modules, so that they can be imported
 */
declare module "*.html" {
  const value: string;
  export default value;
}
