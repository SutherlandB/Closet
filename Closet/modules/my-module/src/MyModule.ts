import { NativeModule, requireNativeModule } from 'expo';

import { MyModuleEvents } from './MyModule.types';

declare class MyModule extends NativeModule<MyModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;

  getSubjectImageData(imagePath: string): Promise<{
    uri: string;
    bounds: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<MyModule>('MyModule');
