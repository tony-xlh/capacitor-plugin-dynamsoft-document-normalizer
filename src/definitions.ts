export interface DocumentNormalizerPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
}
