/// <reference types="vite/client" />

declare module 'react-simple-maps' {
  import type { CSSProperties, FC, MouseEvent, ReactNode } from 'react';

  export interface GeographySpec {
    rsmKey: string;
    properties: Record<string, unknown>;
    [key: string]: unknown;
  }

  export const ComposableMap: FC<{
    children?: ReactNode;
    projection?: string;
    projectionConfig?: {
      center?: [number, number];
      scale?: number;
      rotate?: [number, number, number];
    };
    width?: number;
    height?: number;
    style?: CSSProperties;
  }>;

  export const Geographies: FC<{
    geography: unknown;
    children: (arg: { geographies: GeographySpec[] }) => ReactNode;
  }>;

  export const Geography: FC<{
    geography: GeographySpec;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    style?: {
      default?: CSSProperties;
      hover?: CSSProperties;
      pressed?: CSSProperties;
    };
    onMouseEnter?: (e: MouseEvent) => void;
    onMouseMove?: (e: MouseEvent) => void;
    onMouseLeave?: () => void;
  }>;
}
