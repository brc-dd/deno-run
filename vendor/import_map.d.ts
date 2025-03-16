// @generated file from wasmbuild -- do not edit
// deno-lint-ignore-file
// deno-fmt-ignore-file

export function parseFromJson(
  base_url: string,
  json_string: string,
  expand_imports: boolean,
): JsImportMap;
export class JsImportMap {
  private constructor();
  free(): void;
  resolve(specifier: string, referrer: string): string;
  toJSON(): string;
}
